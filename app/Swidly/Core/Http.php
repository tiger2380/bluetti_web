<?php

namespace Swidly\Core;

// create a class for http client requests and responses
class Http {
    // create a method for sending a request
    private function request($method, $url, $headers = [], $body = null) {
        // create a curl resource
        $curl = \curl_init();

        // set curl options
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
        ]);

        // execute curl request
        $response = curl_exec($curl);

        // get curl info
        $info = curl_getinfo($curl);

        // close curl resource
        curl_close($curl);

        // return response
        return [
            'headers' => $this->parseHeaders(substr($response, 0, $info['header_size'])),
            'body' => substr($response, $info['header_size']),
            'info' => $info,
        ];
    }

    // create a method for parsing headers
    protected function parseHeaders($headers) {
        // create an array for headers
        $parsedHeaders = [];

        // split headers by new line
        $headers = explode("\r\n", $headers);

        // loop through headers
        foreach ($headers as $header) {
            // split header by colon
            $header = explode(':', $header);

            // check if header is valid
            if (count($header) > 1) {
                // get header name
                $name = trim(array_shift($header));

                // get header value
                $value = trim(implode(':', $header));

                // check if header name exists
                if (isset($parsedHeaders[$name])) {
                    // check if header name is an array
                    if (!is_array($parsedHeaders[$name])) {
                        // convert header name to an array
                        $parsedHeaders[$name] = [$parsedHeaders[$name]];
                    }

                    // add header value to header name
                    $parsedHeaders[$name][] = $value;
                } else {
                    // add header value to header name
                    $parsedHeaders[$name] = $value;
                }
            }
        }

        // return parsed headers
        return $parsedHeaders;
    }

    // create a method for sending a get request
    public function get($url, $headers = []) {
        // send a get request
        return $this->request('GET', $url, $headers);
    }

    // create a method for sending a post request
    public function post($url, $headers = [], $body = null) {
        // send a post request
        return $this->request('POST', $url, $headers, $body);
    }

    // create a method for sending a put request
    public function put($url, $headers = [], $body = null) {
        // send a put request
        return $this->request('PUT', $url, $headers, $body);
    }

    // create a method for sending a patch request
    public function patch($url, $headers = [], $body = null) {
        // send a patch request
        return $this->request('PATCH', $url, $headers, $body);
    }

    // create a method for sending a delete request
    public function delete($url, $headers = [], $body = null) {
        // send a delete request
        return $this->request('DELETE', $url, $headers, $body);
    }

    // create a method for sending a head request
    public function head($url, $headers = []) {
        // send a head request
        return $this->request('HEAD', $url, $headers);
    }

    // create a method for sending an options request
    public function options($url, $headers = []) {
        // send an options request
        return $this->request('OPTIONS', $url, $headers);
    }

    // create a method for sending a trace request
    public function trace($url, $headers = []) {
        // send a trace request
        return $this->request('TRACE', $url, $headers);
    }

    // create a method for sending a connect request
    public function connect($url, $headers = []) {
        // send a connect request
        return $this->request('CONNECT', $url, $headers);
    }

    // create a method for sending a request
    public function __call($method, $arguments) {
        // check if method exists
        if (method_exists($this, $method)) {
            // call method
            return call_user_func_array([$this, $method], $arguments);
        }
    }
}