<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(ProductCategory::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:product_categories,name',
            'status' => 'nullable|in:active,inactive',
        ]);

        $category = ProductCategory::create($validated);

        return $this->successResponse($category, 'Category created successfully', 201);
    }

    public function show(ProductCategory $category)
    {
        return $this->successResponse($category);
    }

    public function update(Request $request, ProductCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:product_categories,name,' . $category->id,
            'status' => 'nullable|in:active,inactive',
        ]);

        $category->update($validated);

        return $this->successResponse($category);
    }

    public function destroy(ProductCategory $category)
    {
        if ($category->products()->count() > 0) {
            return $this->errorResponse('Cannot delete category with products', 400);
        }
        
        $category->delete();

        return $this->successResponse([], 'Category deleted successfully');
    }

    public function getActive()
    {
        return $this->successResponse(ProductCategory::where('status', 'active')->get());
    }
}
