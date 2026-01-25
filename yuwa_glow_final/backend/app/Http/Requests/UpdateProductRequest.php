<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'sometimes|exists:product_categories,id',
            'name' => 'sometimes|string|max:150',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'nullable|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|max:20480',
            'variants' => 'nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.exists' => 'The selected category does not exist.',
            'name.max' => 'Product name cannot exceed 150 characters.',
            'price.numeric' => 'Price must be a valid number.',
            'price.min' => 'Price cannot be negative.',
            'images.*.image' => 'Each file must be a valid image.',
            'images.*.max' => 'Each image cannot exceed 20MB.',
        ];
    }
}
