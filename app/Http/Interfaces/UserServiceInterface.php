<?php

namespace App\Http\Interfaces;

interface UserServiceInterface
{
    public function login($data);
    public function refresh();
    public function getUsers();
}
