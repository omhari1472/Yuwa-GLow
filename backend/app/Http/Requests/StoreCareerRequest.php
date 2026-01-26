<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCareerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:150',
            'department' => 'required|string|max:100',
            'location' => 'required|string|max:100',
            'description' => 'required|string',
            'status' => 'required|in:open,closed',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Job title is required.',
            'title.max' => 'Job title cannot exceed 150 characters.',
            'department.required' => 'Department is required.',
            'department.max' => 'Department cannot exceed 100 characters.',
            'location.required' => 'Location is required.',
            'location.max' => 'Location cannot exceed 100 characters.',
            'description.required' => 'Job description is required.',
            'status.required' => 'Please select job status.',
            'status.in' => 'Status must be either open or closed.',
        ];
    }
}
