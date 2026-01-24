<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGalleryRequest;
use App\Http\Requests\UpdateGalleryRequest;
use App\Models\Gallery;
use App\Services\GalleryService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    use ApiResponse;

    protected $galleryService;

    public function __construct(GalleryService $galleryService)
    {
        $this->galleryService = $galleryService;
    }

    public function index(Request $request)
    {
        // If not authenticated (public), only show published items
        if (!$request->user()) {
            return $this->successResponse(
                Gallery::where('status', 'published')
                    ->orderBy('created_at', 'desc')
                    ->get()
            );
        }

        // Admin sees all items
        return $this->successResponse(Gallery::orderBy('created_at', 'desc')->get());
    }

    public function store(StoreGalleryRequest $request)
    {
        try {
            $gallery = $this->galleryService->createGallery($request->validated(), $request->file('image'));
            return $this->successResponse($gallery, 'Gallery item added', 201);
        } catch (\Exception $e) {
            \Log::error('Gallery Store Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to add gallery item.');
        }
    }

    public function update(UpdateGalleryRequest $request, Gallery $gallery)
    {
        try {
            $updated = $this->galleryService->updateGallery($gallery, $request->validated(), $request->file('image'));
            return $this->successResponse($updated, 'Gallery item updated');
        } catch (\Exception $e) {
            \Log::error('Gallery Update Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update gallery item.');
        }
    }

    public function destroy(Gallery $gallery)
    {
        $this->galleryService->deleteGallery($gallery);
        return $this->successResponse([], 'Gallery item deleted');
    }
}
