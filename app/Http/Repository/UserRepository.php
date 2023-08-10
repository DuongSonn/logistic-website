<?php

namespace App\Http\Repository;

use App\Http\Interfaces\UserRepositoryInterface;
use App\Models\Role;
use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    public function findUserByEmail(string $email)
    {
        $user = User::where('email', $email)->first();
        return $user;
    }

    public function findByRole($role)
    {
        $users = User::where('role', '!=', $role)->get();
        return $users;
    }
}