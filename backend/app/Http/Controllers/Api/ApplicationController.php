<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = Application::with('career');
        
        if ($request->has('type')) {
            $query->where('application_type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'application_type' => 'required|in:career,super_stockist,distributor',
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'phone' => 'required|string|max:20',
            
            // Career specific
            'career_id' => 'required_if:application_type,career|exists:careers,id',
            'resume' => 'required_if:application_type,career|file|mimes:pdf,doc,docx|max:5120',

            // Stockist/Distributor specific
            'state' => 'required_if:application_type,super_stockist,distributor|string|max:100',
            'district' => 'required_if:application_type,distributor|string|max:100',
            'address' => 'required_if:application_type,super_stockist|string',
        ]);

        $data = $request->except(['resume']);

        if ($request->hasFile('resume')) {
            $data['resume_url'] = $request->file('resume')->store('resumes', 'public');
        }

        $application = Application::create($data);

        return response()->json($application, 201);
    }

    public function updateStatus(Request $request, Application $application)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $application->update(['status' => $request->status]);

        return response()->json($application);
    }

    public function destroy(Application $application)
    {
        if ($application->resume_url) {
            Storage::disk('public')->delete($application->resume_url);
        }
        $application->delete();
        return response()->json(['message' => 'Application deleted successfully']);
    }

    public function getApproved(Request $request)
    {
        $type = $request->query('type');
        if (!in_array($type, ['super_stockist', 'distributor'])) {
            return response()->json(['message' => 'Invalid type'], 400);
        }

        return response()->json(Application::where('application_type', $type)
            ->where('status', 'approved')
            ->get());
    }
}