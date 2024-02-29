<?php

//namespace Swidly\Socket;

class SwidlySocket
{
    private $conn;
    private $server;
    private $clients;
    private $sslContext;
    private $isConnected;
    private $events;
    private $topics;

    public function __construct(ConnectionString $conn)
    {
        $this->conn = $conn;
        $this->sslContext = null;
        $this->isConnected = false;
        $this->events = [] ;
        $this->topics = [];
       
        if ($conn->isSecure()) {
            $this->sslContext = $this->secure();
        }

         $this->server = stream_socket_server($conn->getConnectionString(), $errno, $errstr, STREAM_SERVER_BIND | STREAM_SERVER_LISTEN, $this->sslContext);
        
         $this->clients = array($this->server);
        if ($this->server === false) {
            throw new \Exception('Could not create socket: ' . socket_strerror(socket_last_error()));
        }
    }
    
    public function on(string $name, \closure $callback): void {
       $this->events[$name] = $callback;
    }

    public function off($namer) {
        unset($this->events[$name]);
    }

    public function trigger(string $name, mixed $data = null) {
        if (!isset($this->events[$name])) {
            return;
        }
        
        foreach ($this->events[$name] as $callback) {
            call_user_func($callback, $data);
        }
    }

    public function sendMessage($message) {
        foreach ($this->clients as $client) {
            @fwrite($client, $message);
        }
    }

    public function subscribe($data, $socket) {
        $eventName = $data['name'];
        $event = new Event($eventName, $socket);
        $listener = new Listener();
        $event->attach($listener);

        $this->topics[$eventName][] = $event;
    }

    public function publish($data) {
        $eventName = $data['name'];
        $events = $this->topics[$eventName];
        
        foreach ($events as $one_event) {
            $one_event->setData($data['data']);
            $one_event->notify();
        }
    }

    public function connect() {
        $this->trigger('connecting');
        $this->isConnected = true;
        $write = null;
        $except = null;

        while ($this->isConnected) {
            $changed = $this->clients;
            if (stream_select($changed, $write, $except, 5)) {
                if (in_array($this->server, $changed)) {
                    $client = @stream_socket_accept($this->server);
                    $this->trigger('connected', $client);
                    if (!$client){ continue; }
                    $this->clients[] = $client;
                    $ip = stream_socket_get_name( $client, true );
                    echo "New Client connected from $ip\n";
                    
                    stream_set_blocking($client, true);
                    $headers = fread($client, 1500);
                    $this->handshake($client, $headers, $this->conn->host, $this->conn->port);
                    stream_set_blocking($client, false);

                    $this->sendMessage(self::mask($ip . ' connected'));
                    $found_socket = array_search($this->server, $changed);
                    unset($changed[$found_socket]);     
                }
                foreach ($changed as $changed_socket) {
                    $ip = stream_socket_get_name( $changed_socket, true );
                    $buffer = stream_get_contents($changed_socket);
                    if ($buffer == false) {
                        echo "Client Disconnected from $ip\n";
                        @fclose($changed_socket);
                        $found_socket = array_search($changed_socket, $this->clients);
                        
                        $this->disconnect($found_socket);

                        $this->trigger('client_disconnected');
                    }
                    $unmasked = self::unmask($buffer);

                    if (self::isJson($unmasked)) {
                        $socket = $changed_socket;
                        $json = json_decode($unmasked, true);
                        
                        switch($json['type']) {
                            case 'subscribe':
                                $this->subscribe($json, $socket);
                                break;
                            case 'publish':
                                $this->publish($json);
                                break;
                            default:
                                echo 'Unknown command';
                        }
                    }
                }
            }
        }
        $this->closeConnection();
    }

    public static function isJson(string $data) {
        json_decode($data);
        return json_last_error() === JSON_ERROR_NONE;
    }

    public function disconnect($client) {
        print_r('disconnected '. $client);
        $thisClient = $this->clients[$client];
        unset($thisClient);
    }

    public static function unmask($text) {
        $length = @ord($text[1]) & 127;
        if($length == 126) {    $masks = substr($text, 4, 4);    $data = substr($text, 8); }
        elseif($length == 127) {    $masks = substr($text, 10, 4); $data = substr($text, 14); }
        else { $masks = substr($text, 2, 4); $data = substr($text, 6); }
        $text = "";
        for ($i = 0; $i < strlen($data); ++$i) { $text .= $data[$i] ^ $masks[$i % 4];    }
        return $text;
    }
    public static function mask($text) {
        $b1 = 0x80 | (0x1 & 0x0f);
        $length = strlen($text);
        if($length <= 125)
            $header = pack('CC', $b1, $length);
        elseif($length > 125 && $length < 65536)
            $header = pack('CCn', $b1, 126, $length);
        elseif($length >= 65536)
            $header = pack('CCNN', $b1, 127, $length);
        return $header.$text;
    }
    public function handshake($client, $rcvd, $host, $port){
        $headers = array();
        $lines = preg_split("/\r\n/", $rcvd);
        foreach($lines as $line)
        {
            $line = rtrim($line);
            if(preg_match('/\A(\S+): (.*)\z/', $line, $matches)){
                $headers[$matches[1]] = $matches[2];
            }
        }
        $secKey = $headers['Sec-WebSocket-Key'];
        $secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
        //hand shaking header
        $upgrade  = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
        "Upgrade: websocket\r\n" .
        "Connection: Upgrade\r\n" .
        "WebSocket-Origin: $host\r\n" .
        "WebSocket-Location: wss://$host:$port\r\n".
        "Sec-WebSocket-Version: 13\r\n" .
        "Sec-WebSocket-Accept:$secAccept\r\n\r\n";
        
        fwrite($client, $upgrade);
    }

    public function closeConnection() {
        $this->isConnected = false;
        fclose($this->server);
        $this->server = null;
        $this->clients = null;
        $this->sslContext = null;
        $this->conn = null;
    }

    public function secure() {
        $this->ssl = [
            'ssl' => [
                'local_cert' => $this->conn->getCertificate(),
                'allow_self_signed' => true,
                'local_pk' => $this->conn->getPrivateKey(),
                'disable_compression' => true,
                'verify_peer' => false,
                'ssltransport' => $this->conn->getTransport(),
            ]
        ];

        return stream_context_create($this->ssl);
    }
}

class Event implements SplSubject {
    private $observers;
    private $name;
    private $data;
    private $uuid;
    private $socket;

    public function __construct(string $name, $socket) {
        $this->observers = new SplObjectStorage;
        $this->name = $name;
        $this->uuid = generate_uuid();
        $this->socket = $socket;
    }

    public function attach(SplObserver $observer): void {
        $this->observers->attach($observer);
    }

    public function detach(SplObserver $observer): void {
        $this->observers->detach($observer);
    }

    public function notify(): void {
        foreach ($this->observers as $observer) {
            $observer->update($this);
        }
    }

    public function getName() {
        return $this->name;
    }

    public function getUuid() {
        return $this->uuid;
    }

    public function setData($data) {
        $this->data = $data;
    }

    public function getData() {
        return $this->data;
    }

    public function getSocket() {
        return $this->socket;
    }
}

class Listener implements \SplObserver {
    public function update(SplSubject $subject): void {
        $socket = $subject->getSocket();
        fwrite($socket, SwidlySocket::mask(json_encode($subject->getData())));
    }
}

function generate_uuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        random_int(0, 0xffff), random_int(0, 0xffff),
        random_int(0, 0xffff),
        random_int(0, 0x0fff) | 0x4000,
        random_int(0, 0x3fff) | 0x8000,
        random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff)
    );
}