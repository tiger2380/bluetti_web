<?php

class Test {
    public function __construct() {
        echo "Hello World!";
    }

    public function run($file = null) {
        if ($file) {
            echo "Running $file";
        } else {
            echo "Running all tests";
        }
    }

    public function __destruct() {
        echo "Bye World!";
    }
}

class Assert {
    public static function assertEquals($expected, $actual, $message = '') {
        if ($expected != $actual) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertNull($value, $message = '') {
        if ($value !== null) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertNotNull($value, $message = '') {
        if ($value === null) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function fail($message = '') {
        throw new Exception("Assertion failed: " . $message);
    }

    public static function assertSame($expected, $actual, $message = '') {
        if ($expected !== $actual) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertNotSame($expected, $actual, $message = '') {
        if ($expected === $actual) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertFalse($condition, $message = '') {
        if ($condition) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertNotFalse($condition, $message = '') {
        if ($condition) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertTrue($condition, $message = '') {
        if (!$condition) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertNotTrue($condition, $message = '') {
        if ($condition) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertGreaterThan($expected, $actual, $message = '') {
        if ($actual <= $expected) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertLessThan($expected, $actual, $message = '') {
        if ($actual >= $expected) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertGreaterThanOrEqual($expected, $actual, $message = '') {
        if ($actual < $expected) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertLessThanOrEqual($expected, $actual, $message = '') {
        if ($actual > $expected) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertArrayHasKey($key, $array, $message = '') {
        if (!array_key_exists($key, $array)) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertArrayNotHasKey($key, $array, $message = '') {
        if (array_key_exists($key, $array)) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertFileExists($file, $message = '') {
        if (!file_exists($file)) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertFileNotExists($file, $message = '') {
        if (file_exists($file)) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertDirectoryExists($directory, $message = '') {
        if (!is_dir($directory)) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertDirectoryNotExists($directory, $message = '') {
        if (is_dir($directory)) {
            throw new Exception("Assertion failed: " . $message);
        }
    }
    
    public static function assertRegExp($pattern, $string, $message = '') {
        if (!preg_match($pattern, $string)) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertNotRegExp($pattern, $string, $message = '') {
        if (preg_match($pattern, $string)) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertStringContains($needle, $haystack, $message = '') {
        if (strpos($haystack, $needle) === false) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertStringNotContains($needle, $haystack, $message = '') {
        if (strpos($haystack, $needle) !== false) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertStringEndsWith($needle, $haystack, $message = '') {
        if (substr($haystack, -strlen($needle)) !== $needle) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertStringStartsWith($needle, $haystack, $message = '') {
        if (substr($haystack, 0, strlen($needle)) !== $needle) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertStringMatchesFormat($format, $string, $message = '') {
        if (!preg_match($format, $string)) {
            throw new Exception("Assertion failed: " . $message);
        }
    }

    public static function assertStringNotMatchesFormat($format, $string, $message = '') {
        if (preg_match($format, $string)) {
            throw new Exception("Assertion failed: " . $message);
        }
    }
}