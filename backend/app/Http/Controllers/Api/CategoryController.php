<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(ProductCategory::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'status' => 'nullable|in:active,inactive',
        ]);

        $category = ProductCategory::create($validated);

        return response()->json($category, 201);
    }

    public function show(ProductCategory $category)
    {
        return response()->json($category);
    }

    public function update(Request $request, ProductCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'status' => 'nullable|in:active,inactive',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy(ProductCategory $category)
    {
        if ($category->products()->count() > 0) {
            return response()->json(['message' => 'Cannot delete category with products'], 400);
        }
        
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

    public function getActive()
    {
        return response()->json(ProductCategory::where('status', 'active')->get());
    }
}