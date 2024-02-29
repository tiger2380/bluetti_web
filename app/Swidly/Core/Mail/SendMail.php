<?php

class SendMail {
    public static function send($to, $subject, $message) {
        $headers = "From: Swidly <";
        $from = "Swidly <";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        
        return mail($to, $subject, $message, $headers);
    }

    public static function sendWithTemplate($to, $subject, $template, $data) {
        $headers = "From: Swidly <";
        $from = "Swidly <";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

        foreach($data as $key => $value) {
            $template = str_replace("{{ $key }}", $value, $template);
        }
        
        return mail($to, $subject, $template, $headers);
    }

    public static function sendWithTemplateFile($to, $subject, $template, $data) {
        $headers = "From: Airbux";
        $from = "Airbux";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

        foreach($data as $key => $value) {
            $template = str_replace("{{ $key }}", $value, $template);
        }
        
        return mail($to, $subject, $template, $headers);
    }
}