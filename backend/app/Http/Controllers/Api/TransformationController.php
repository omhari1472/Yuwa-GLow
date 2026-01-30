<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransformationRequest;
use App\Http\Requests\UpdateTransformationRequest;
use App\Models\Transformation;
use App\Services\TransformationService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TransformationController extends Controller
{
    use ApiResponse;

    protected $transformationService;

    public function __construct(TransformationService $transformationService)
    {
        $this->transformationService = $transformationService;
    }

    public function index(Request $request)
    {
        // If not authenticated (public), only show published items
        if (!$request->user()) {
            return $this->successResponse(
                Transformation::published()
                    ->ordered()
                    ->get()
            );
        }

        // Admin sees all items
        return $this->successResponse(Transformation::ordered()->get());
    }

    public function store(StoreTransformationRequest $request)
    {
        try {
            $transformation = $this->transformationService->createTransformation(
                $request->validated(),
                $request->file('before_image'),
                $request->file('after_image')
            );
            return $this->successResponse($transformation, 'Transformation added', 201);
        } catch (\Exception $e) {
            \Log::error('Transformation Store Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to add transformation.');
        }
    }

    public function show(Transformation $transformation)
    {
        return $this->successResponse($transformation);
    }

    public function update(UpdateTransformationRequest $request, Transformation $transformation)
    {
        try {
            $updated = $this->transformationService->updateTransformation(
                $transformation,
                $request->validated(),
                $request->file('before_image'),
                $request->file('after_image')
            );
            return $this->successResponse($updated, 'Transformation updated');
        } catch (\Exception $e) {
            \Log::error('Transformation Update Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update transformation.');
        }
    }

    public function destroy(Transformation $transformation)
    {
        $this->transformationService->deleteTransformation($transformation);
        return $this->successResponse([], 'Transformation deleted');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:transformations,id',
        ]);

        try {
            $this->transformationService->reorder($request->order);
            return $this->successResponse([], 'Transformations order updated');
        } catch (\Exception $e) {
            \Log::error('Transformation Reorder Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update transformations order.');
        }
    }
}
