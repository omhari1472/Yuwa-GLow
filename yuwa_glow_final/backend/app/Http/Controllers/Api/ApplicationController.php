<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Services\ApplicationService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    use ApiResponse;

    protected $applicationService;

    public function __construct(ApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    public function index(Request $request)
    {
        $query = Application::with('career');
        
        if ($request->has('type')) {
            $query->where('application_type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return $this->successResponse($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'application_type' => 'required|in:career,super_stockist,distributor',
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'phone' => 'required|string|max:20',
            'resume' => 'required_if:application_type,career|file|mimes:pdf,doc,docx|max:5120',
        ]);

        try {
            $data = $request->except(['resume']);
            $resume = $request->file('resume');
            
            $application = $this->applicationService->submitApplication($data, $resume);
            
            return $this->successResponse($application, 'Application submitted successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Submission failed: ' . $e->getMessage());
        }
    }

    public function updateStatus(Request $request, Application $application)
    {
        $request->validate(['status' => 'required|in:pending,approved,rejected']);

        $updated = $this->applicationService->updateStatus($application, $request->status);
        
        return $this->successResponse($updated, 'Status updated successfully');
    }

    public function destroy(Application $application)
    {
        $this->applicationService->deleteApplication($application);
        return $this->successResponse([], 'Application deleted successfully');
    }

    public function getApproved(Request $request)
    {
        // Type can come from route defaults or query string
        $type = $request->route('type') ?? $request->query('type');
        if (!in_array($type, ['super_stockist', 'distributor'])) {
            return $this->errorResponse('Invalid application type requested.');
        }

        $approved = Application::where('application_type', $type)
            ->where('status', 'approved')
            ->get();

        return $this->successResponse($approved);
    }
}
