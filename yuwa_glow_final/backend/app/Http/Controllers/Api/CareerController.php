<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Career;
use App\Services\CareerService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CareerController extends Controller
{
    use ApiResponse;

    protected $careerService;

    public function __construct(CareerService $careerService)
    {
        $this->careerService = $careerService;
    }

    /**
     * Admin Index - Returns all openings (Open + Closed)
     */
    public function index()
    {
        $careers = Career::orderBy('created_at', 'desc')->get();
        return $this->successResponse($careers);
    }

    /**
     * Public Index - Returns only Open positions
     */
    public function getOpen()
    {
        $careers = Career::where('status', 'open')->orderBy('created_at', 'desc')->get();
        return $this->successResponse($careers);
    }

    /**
     * Show a single career opening
     */
    public function show(Career $career)
    {
        return $this->successResponse($career);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:150',
            'department' => 'required|string|max:100',
            'location' => 'required|string|max:100',
            'description' => 'required|string',
            'status' => 'required|in:open,closed',
        ]);

        $career = $this->careerService->createCareer($request->all());
        return $this->successResponse($career, 'Career opening created', 201);
    }

    public function update(Request $request, Career $career)
    {
        $career = $this->careerService->updateCareer($career, $request->all());
        return $this->successResponse($career, 'Career opening updated');
    }

    public function destroy(Career $career)
    {
        $this->careerService->deleteCareer($career);
        return $this->successResponse([], 'Career opening deleted');
    }
}