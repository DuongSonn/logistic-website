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
        $this->middleware('auth:api', ['except' => ['login']]);     
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        // Call the UserService to create a new user
        $data = $this->userService->login($data);

        // Handle the response or redirect as needed
        if ($data['success'] == false) {
            return response()->json($data, 500);
        }

        return response()->json($data, 200);
    }

    public function refresh()
    {
        // Call the UserService to create a new user
        $data = $this->userService->refresh();

        return response()->json($data, 200);
    }
}
