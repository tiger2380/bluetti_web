<?php

namespace Swidly\themes\default\models;

use Swidly\Core\Attributes\Column;
use Swidly\Core\Attributes\Table;
use Swidly\Core\Enums\Types;
use Swidly\Core\Model;

#[Table(name: 'users')]
class UserModel extends Model {
    #[Column(type: Types::INTEGER, isPrimary: true)]
    public int $id;

    #[Column(type: Types::STRING)]
    public string $password;

    #[Column(type: Types::STRING)]
    public string $email;

    #[Column(type: Types::STRING)]
    public string $first_name;

    #[Column(type: Types::STRING)]
    public string $last_name;

    public function getId(): int {
        return $this->id ?? 0;
    }

    public function getPassword(): string {
        return $this->password ?? '';
    }

    public function getEmail(): string {
        return $this->email ?? '';
    }

    public function getFirstName(): string {
        return $this->first_name ?? '';
    }

    public function getLastName(): string {
        return $this->last_name ?? '';
    }

    public function setPassword(string $password): void {
        $this->password = $password;
    }

    public function setEmail(string $email): void {
        $this->email = $email;
    }

    public function setFirstName(string $first_name): void {
        $this->first_name = $first_name;
    }

    public function setLastName(string $last_name): void {
        $this->last_name = $last_name;
    }
}