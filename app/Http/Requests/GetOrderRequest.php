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
            'offset' => 'optional|integer|min:0|default:0',
            'limit' => 'optional|integer|min:0|default:20',
            'order_number' => 'optional|string',
            'customer_name' => 'optional|string',
            'shipping_date' => 'optional|integer',
        ];
    }
}
