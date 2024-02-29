<?php

use Swidly\Core\Model;
use Swidly\Core\Attributes\Table;
use Swidly\Core\Attributes\Column;
use Swidly\Core\Enums\Types;

#[Table(name: 'login_tokens')]
class LoginTokensModel extends Model {
    #[Column(type: Types::INTEGER, isPrimary: true)]
    public int $id;

    #[Column(type: Types::STRING, length: 50)]
    private ?string $email = null;

    #[Column(type: Types::INTEGER)]
    private int $token;

    #[Column(type: Types::TIMESTAMP)]
    private string $timestamp;

    public function getId(): int {
        return $this->id ?? 0;
    }

    public function getEmail(): string {
        return $this->email;
    }

    public function setEmail(string $email): self {
        $this->email = $email;

        return $this;
    }

    public function setToken(int $token): self {
        $this->token = $token;

        return $this;
    }

    public function getToken(): int {
        return $this->token;
    }

    public function setTimestamp(string $timestamp): self {
        $this->timestamp = $timestamp;

        return $this;
    }

    public function getTimestamp(): string {
        return $this->timestamp;
    }
}