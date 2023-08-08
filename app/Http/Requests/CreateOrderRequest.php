<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends ApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            //
            'shipping_date' => 'integer|required',
            'delivery_date' => 'integer|required',
            'shipping_address' => 'string|required',
            'delivery_address' => 'string|required',
            'products' => 'array|required'
        ];
    }
}
