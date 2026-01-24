<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:150',
            'type' => 'required|in:image,video',
            'media_url' => 'required_if:type,video|nullable|url',
            'image' => 'required_if:type,image|nullable|image|max:5120',
            'status' => 'nullable|in:draft,published'
        ]);

        try {
            $gallery = $this->galleryService->createGallery($request->all(), $request->file('image'));
            return $this->successResponse($gallery, 'Gallery item added', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to add gallery item.');
        }
    }

    public function update(Request $request, Gallery $gallery)
    {
        $request->validate([
            'title' => 'sometimes|string|max:150',
            'type' => 'sometimes|in:image,video',
            'media_url' => 'required_if:type,video|nullable|url',
            'image' => 'nullable|image|max:5120',
            'status' => 'nullable|in:draft,published'
        ]);

        try {
            $updated = $this->galleryService->updateGallery($gallery, $request->all(), $request->file('image'));
            return $this->successResponse($updated, 'Gallery item updated');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update gallery item.');
        }
    }

    public function destroy(Gallery $gallery)
    {
        $this->galleryService->deleteGallery($gallery);
        return $this->successResponse([], 'Gallery item deleted');
    }
}
