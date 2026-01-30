<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransformationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:150',
            'description' => 'nullable|string|max:500',
            'before_image' => 'nullable|image|max:20480',
            'after_image' => 'nullable|image|max:20480',
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'nullable|in:published,draft',
        ];
    }

    public function messages(): array
    {
        return [
            'title.max' => 'Title cannot exceed 150 characters.',
            'description.max' => 'Description cannot exceed 500 characters.',
            'before_image.image' => 'Before file must be a valid image.',
            'before_image.max' => 'Before image cannot exceed 20MB.',
            'after_image.image' => 'After file must be a valid image.',
            'after_image.max' => 'After image cannot exceed 20MB.',
            'sort_order.integer' => 'Sort order must be a number.',
            'status.in' => 'Status must be either published or draft.',
        ];
    }
}
