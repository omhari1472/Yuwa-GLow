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

    public function index()
    {
        return $this->successResponse(Gallery::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:150',
            'type' => 'required|in:image,video',
            'media_url' => 'required_if:type,video|nullable|url',
            'image' => 'required_if:type,image|nullable|image|max:5120'
        ]);

        try {
            $gallery = $this->galleryService->createGallery($request->all(), $request->file('image'));
            return $this->successResponse($gallery, 'Gallery item added', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to add gallery item.');
        }
    }

    public function destroy(Gallery $gallery)
    {
        $this->galleryService->deleteGallery($gallery);
        return $this->successResponse([], 'Gallery item deleted');
    }
}
