<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReplyEnquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reply' => 'required|string|max:5000',
        ];
    }

    public function messages(): array
    {
        return [
            'reply.required' => 'Reply message is required.',
            'reply.max' => 'Reply cannot exceed 5000 characters.',
        ];
    }
}
