<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationStatusRequest;
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

    public function store(StoreApplicationRequest $request)
    {
        try {
            $data = $request->except(['resume']);
            $resume = $request->file('resume');

            $application = $this->applicationService->submitApplication($data, $resume);

            return $this->successResponse($application, 'Application submitted successfully', 201);
        } catch (\Exception $e) {
            \Log::error('Application Submit Error: ' . $e->getMessage());
            return $this->errorResponse('Submission failed: ' . $e->getMessage());
        }
    }

    public function updateStatus(UpdateApplicationStatusRequest $request, Application $application)
    {
        try {
            $updated = $this->applicationService->updateStatus($application, $request->status);
            return $this->successResponse($updated, 'Status updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
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

    public function checkAvailability()
    {
        $occupied = Application::where('status', 'approved')
            ->whereIn('application_type', ['super_stockist', 'distributor'])
            ->select('application_type', 'state', 'district')
            ->get();

        return $this->successResponse($occupied);
    }
}
