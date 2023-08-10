<?php

namespace App\Http\Interfaces;

interface UserRepositoryInterface
{
    public function findUserByEmail(string $email);
    public function findByRole($role);
}
