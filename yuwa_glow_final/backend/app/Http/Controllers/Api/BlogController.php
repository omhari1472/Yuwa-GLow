<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Services\BlogService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    use ApiResponse;

    protected $blogService;

    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }

    public function index(Request $request)
    {
        $query = Blog::query();
        if (!$request->user()) {
            $query->where('status', 'published');
        }
        return $this->successResponse($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'status' => 'nullable|in:draft,published',
            'featured_image' => 'nullable|image|max:2048',
        ]);

        try {
            $blog = $this->blogService->createBlog($request->all());
            return $this->successResponse($blog, 'Blog created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create blog.');
        }
    }

    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)->firstOrFail();
        return $this->successResponse($blog);
    }

    public function update(Request $request, Blog $blog)
    {
        $request->validate([
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
        ]);

        try {
            $updated = $this->blogService->updateBlog($blog, $request->all());
            return $this->successResponse($updated, 'Blog updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update blog.');
        }
    }

    public function destroy(Blog $blog)
    {
        $this->blogService->deleteBlog($blog);
        return $this->successResponse([], 'Blog deleted successfully');
    }
}
