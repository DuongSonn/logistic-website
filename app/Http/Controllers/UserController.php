<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\UserServiceInterface;
use App\Http\Requests\LoginRequest;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;        
    }

    public function login(LoginRequest $request)
    {
        // Get data from the request
        $data = $request->validated();

        // Call the UserService to create a new user
        $user = $this->userService->login($data);

        // Handle the response or redirect as needed
        return false;
    }
}
