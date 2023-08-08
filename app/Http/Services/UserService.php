<?php

namespace App\Http\Services;

use App\Http\Interfaces\UserRepositoryInterface;
use App\Http\Interfaces\UserServiceInterface;

class UserService implements UserServiceInterface
{
    protected $userRepo;

    public function __construct(UserRepositoryInterface $userRepo) 
    {
        $this->userRepo = $userRepo;
    }


    public function login($data)
    {
        // Your logic to create a user goes here
        return true;
    }

}