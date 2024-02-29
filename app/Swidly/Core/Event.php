<?php
class Event implements SplSubject {
    private $observers;
    private $name;
    private $data;

    public function __construct(string $name) {
        $this->observers = new SplObjectStorage;
        $this->name = $name;
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

    public function setData($data) {
        $this->data = $data;
    }

    public function getData() {
        return $this->data;
    }
}