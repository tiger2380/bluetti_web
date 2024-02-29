<?php

require './Swidly/Socket/Socket.php';
require './Swidly/Socket/ConnectionString.php';

//session_start();
/*$input = file_get_contents('php://input');
$decoded = json_decode($input, true);

// connect to pdo database
$pdo = new PDO('mysql:host=localhost;dbname=bluetti', 'bluetti', 'bluetti');

// insert into database
$statement = $pdo->prepare("INSERT INTO `monitoring` (`ac_input_power`, `ac_output_power`, `dc_input_power`, `battery`, `created_at`) VALUES (:ac_input_power, :ac_output_power, :dc_input_power, :battery, :time)");
$statement->execute(array(
    "ac_input_power" => $decoded['ac_input'],
    "ac_output_power" => $decoded['ac_output'],
    "dc_input_power" => $decoded['dc_input'],
    "battery" => $decoded['battery'],
    "time" => (new DateTime())->format('Y-m-d H:i:s')
));

// close pdo connection
$pdo = null;

// return success
echo json_encode(array(
    "success" => true
));*/
echo "Staring server \n";
$socket = new SwidlySocket(new ConnectionString(
    '0.0.0.0',
    8082,
    'tcp',
    false,
));

$socket->on('connecting', function(){
    var_dump('connecting');
});

$socket->on('connected', function ($client) {
    var_dump('connected');
});
$socket->connect();