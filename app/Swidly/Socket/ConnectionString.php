<?php

//namespace Swidly\Socket;

class ConnectionString {
    public string $host;
    public int $port;
    public string $transport;
    public bool $isSecure = false;

    public function __construct(string $host, int $port, string $transport, string $isSecure) {
        $this->host = $host;
        $this->port = $port;
        $this->transport = $transport;
        $this->isSecure = $isSecure;
    }

    public function getConnectionString(): string {
        return "{$this->transport}://{$this->host}:{$this->port}";
    }

    public function getHost(): string {
        return $this->host;
    }

    public function getPort(): int {
        return $this->port;
    }

    public function getTransport(): string {
        return $this->transport;
    }

    public function isSecure(): bool {
        return $this->isSecure;
    }
}