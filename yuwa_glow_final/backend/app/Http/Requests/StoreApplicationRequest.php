<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'application_type' => 'required|in:career,super_stockist,distributor',
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'phone' => 'required|string|max:20',
            'career_id' => 'required_if:application_type,career|nullable|exists:careers,id',
            'state' => 'required_if:application_type,super_stockist,distributor|nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
            'resume' => 'required_if:application_type,career|nullable|file|mimes:pdf,doc,docx|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'application_type.required' => 'Application type is required.',
            'application_type.in' => 'Invalid application type.',
            'name.required' => 'Your name is required.',
            'name.max' => 'Name cannot exceed 150 characters.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'phone.required' => 'Phone number is required.',
            'phone.max' => 'Phone number cannot exceed 20 characters.',
            'career_id.required_if' => 'Please select a job position.',
            'career_id.exists' => 'The selected job position does not exist.',
            'state.required_if' => 'State is required for partner applications.',
            'resume.required_if' => 'Resume is required for career applications.',
            'resume.mimes' => 'Resume must be a PDF, DOC, or DOCX file.',
            'resume.max' => 'Resume cannot exceed 5MB.',
        ];
    }
}
