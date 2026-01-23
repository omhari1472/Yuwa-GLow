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

    /**
     * Admin Index - Returns all blogs (Draft + Published)
     */
    public function index()
    {
        $blogs = Blog::orderBy('created_at', 'desc')->get();
        return $this->successResponse($blogs);
    }

    /**
     * Public Index - Returns only Published blogs
     */
    public function getPublished()
    {
        $blogs = Blog::where('status', 'published')->orderBy('created_at', 'desc')->get();
        return $this->successResponse($blogs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
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