<?php

namespace App\Helpers;

class ApiResponse
{
    public static function success($data = null, $message = null)
    {
        return [
            'success' => true,
            'data' => $data,
            'message' => $message,
        ];
    }

    public static function error($message = null, $data = null, $statusCode = 400)
    {
        return [
            'success' => false,
            'message' => $message,
            'data' => $data,
        ];
    }
}
