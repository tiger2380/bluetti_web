<?php

spl_autoload_register('autoLoader');

const APP_VERSION = '0.0.1';
const APP_ROOT = __DIR__;
const APP_PATH = APP_ROOT . '/Swidly';
const APP_CORE = APP_PATH . '/Core';
const APP_CONFIG = APP_PATH . '/config';
const APP_THEMES = APP_PATH . '/themes';
const APP_STORAGE = APP_PATH . '/storage';
const APP_PUBLIC = APP_PATH . '/public';
const BASEURL = '';

if (file_exists(APP_CORE . '/helpers.php')) {
    require_once APP_CORE . '/helpers.php';
} else {
    echo 'helpers file doesn\'t exists';
}

function autoLoader($className): void
{
    $paths = [
        APP_PATH . '/Controllers/',
        APP_PATH . '/Core/',
        APP_PATH . '/Middleware/',
        APP_PATH . '/models/',
        APP_PATH . '/PHPMailer/',
    ];

    $filepath = APP_ROOT . '/' . str_replace('\\', '/', $className) . '.php';
    if (file_exists($filepath)) {
        require_once $filepath;
    } else {
        foreach ($paths as $path) {
            $filepath = $path . str_replace('\\', '/', $className) . '.php';
            if (file_exists($filepath)) {
                require_once $filepath;
                break;
            }
        }
    }
}
