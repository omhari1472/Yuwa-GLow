<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarouselRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => 'required|image|max:20480',
            'mobile_image' => 'nullable|image|max:10240',
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'nullable|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'Desktop carousel image is required.',
            'image.image' => 'Desktop file must be a valid image.',
            'image.max' => 'Desktop image cannot exceed 20MB.',
            'mobile_image.image' => 'Mobile file must be a valid image.',
            'mobile_image.max' => 'Mobile image cannot exceed 10MB.',
            'sort_order.integer' => 'Sort order must be a number.',
            'status.in' => 'Status must be either active or inactive.',
        ];
    }
}
