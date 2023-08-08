<?php

namespace App\Http\Requests;

use App\Helpers\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ApiRequest extends FormRequest
{
    protected function failedValidation(Validator $validator)
    {  
        $message = $validator->errors()->first();

        throw new HttpResponseException(
            response()->json(ApiResponse::error($message, null), 402)
        );
    }
}
