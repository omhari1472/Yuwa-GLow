<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGalleryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:150',
            'type' => 'sometimes|in:image,video',
            'media_url' => 'required_if:type,video|nullable|url',
            'image' => 'nullable|image|max:20480',
            'status' => 'nullable|in:draft,published',
        ];
    }

    public function messages(): array
    {
        return [
            'title.max' => 'Gallery title cannot exceed 150 characters.',
            'type.in' => 'Media type must be either image or video.',
            'media_url.required_if' => 'Video URL is required for video type.',
            'media_url.url' => 'Please provide a valid video URL.',
            'image.image' => 'File must be a valid image.',
            'image.max' => 'Image cannot exceed 20MB.',
            'status.in' => 'Status must be either draft or published.',
        ];
    }
}
