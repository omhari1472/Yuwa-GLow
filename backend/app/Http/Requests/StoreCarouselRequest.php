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
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'nullable|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'Carousel image is required.',
            'image.image' => 'File must be a valid image.',
            'image.max' => 'Image cannot exceed 20MB.',
            'sort_order.integer' => 'Sort order must be a number.',
            'status.in' => 'Status must be either active or inactive.',
        ];
    }
}
