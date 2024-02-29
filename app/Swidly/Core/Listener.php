<?php

use SplSubject;

namespace Swidly\Core;

class Listener implements \SplObserver {
    public function update(SplSubject $subject) {
        echo "Event {$subject->getName()} has been triggered with data: " . print_r($subject->getData(), true) . "\n";
    }
}