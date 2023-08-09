<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetOrderRequest extends ApiRequest
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
            'offset' => 'nullable|integer|min:0',
            'limit' => 'nullable|integer|min:0',
            'number_order' => 'nullable|string',
            'customer_name' => 'nullable|string',
            'shipping_date' => 'nullable|integer',
        ];
    }
}
