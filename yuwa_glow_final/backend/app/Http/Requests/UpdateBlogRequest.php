<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'featured_image' => 'nullable|image|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Blog title is required.',
            'title.max' => 'Blog title cannot exceed 200 characters.',
            'content.required' => 'Blog content is required.',
            'status.required' => 'Please select a publishing status.',
            'status.in' => 'Status must be either draft or published.',
            'featured_image.image' => 'Featured image must be a valid image file.',
            'featured_image.max' => 'Featured image cannot exceed 2MB.',
        ];
    }
}
