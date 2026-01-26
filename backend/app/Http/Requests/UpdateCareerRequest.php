<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCareerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:150',
            'department' => 'sometimes|string|max:100',
            'location' => 'sometimes|string|max:100',
            'description' => 'sometimes|string',
            'status' => 'sometimes|in:open,closed',
        ];
    }

    public function messages(): array
    {
        return [
            'title.max' => 'Job title cannot exceed 150 characters.',
            'department.max' => 'Department cannot exceed 100 characters.',
            'location.max' => 'Location cannot exceed 100 characters.',
            'status.in' => 'Status must be either open or closed.',
        ];
    }
}
