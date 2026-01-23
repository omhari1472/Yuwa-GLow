<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactEnquiry;
use Illuminate\Http\Request;

class ContactEnquiryController extends Controller
{
    public function index()
    {
        return response()->json(ContactEnquiry::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        $enquiry = ContactEnquiry::create($validated);

        return response()->json($enquiry, 201);
    }

    public function destroy(ContactEnquiry $enquiry)
    {
        $enquiry->delete();
        return response()->json(['message' => 'Enquiry deleted successfully']);
    }
}