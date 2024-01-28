<?php

session_start();
require __DIR__ . '/../bootstrap.php';

(new Swidly\Core\Swidly(
    new Swidly\Core\Response,
    new Swidly\Core\Form,
    new Swidly\Core\Request,
    new Swidly\Core\Router(
        new Swidly\Core\Request,
        new Swidly\Core\Response)
))->run();