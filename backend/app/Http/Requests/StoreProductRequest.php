<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:150',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'status' => 'nullable|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|max:20480',
            'variants' => 'nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Please select a product category.',
            'category_id.exists' => 'The selected category does not exist.',
            'name.required' => 'Product name is required.',
            'name.max' => 'Product name cannot exceed 150 characters.',
            'description.required' => 'Product description is required.',
            'price.required' => 'Product price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'price.min' => 'Price cannot be negative.',
            'images.*.image' => 'Each file must be a valid image.',
            'images.*.max' => 'Each image cannot exceed 20MB.',
        ];
    }
}
