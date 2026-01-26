<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactEnquiryRequest;
use App\Http\Requests\ReplyEnquiryRequest;
use App\Http\Requests\UpdateEnquiryStatusRequest;
use App\Models\ContactEnquiry;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ContactEnquiryController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(ContactEnquiry::orderBy('created_at', 'desc')->get());
    }

    public function store(StoreContactEnquiryRequest $request)
    {
        $enquiry = ContactEnquiry::create($request->validated());
        return $this->successResponse($enquiry, 'Enquiry submitted successfully', 201);
    }

    public function reply(ReplyEnquiryRequest $request, ContactEnquiry $contactEnquiry)
    {
        $contactEnquiry->update([
            'reply' => $request->reply,
            'status' => 'replied',
            'replied_at' => now(),
        ]);

        return $this->successResponse($contactEnquiry, 'Reply saved successfully');
    }

    public function updateStatus(UpdateEnquiryStatusRequest $request, ContactEnquiry $contactEnquiry)
    {
        $contactEnquiry->update([
            'status' => $request->status,
        ]);

        return $this->successResponse($contactEnquiry, 'Status updated successfully');
    }

    public function destroy(ContactEnquiry $contactEnquiry)
    {
        $contactEnquiry->delete();
        return $this->successResponse([], 'Enquiry deleted successfully');
    }
}