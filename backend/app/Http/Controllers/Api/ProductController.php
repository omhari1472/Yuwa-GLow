<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with(['category', 'variants', 'images'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:150',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'status' => 'nullable|in:active,inactive',
            'variants' => 'nullable|array',
            'variants.*.variant_name' => 'required|string',
            'variants.*.variant_value' => 'required|string',
            'variants.*.price' => 'required|numeric',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $product = Product::create($request->only(['category_id', 'name', 'description', 'price', 'status']));

        // Handle Variants
        if ($request->has('variants')) {
            foreach ($request->variants as $variant) {
                $product->variants()->create($variant);
            }
        }

        // Handle Images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['image_url' => $path]);
            }
        }

        return response()->json($product->load(['variants', 'images']), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'variants', 'images']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:150',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'status' => 'nullable|in:active,inactive',
        ]);

        $product->update($request->only(['category_id', 'name', 'description', 'price', 'status']));

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        // Delete images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_url);
        }
        
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function getActive()
    {
        return response()->json(Product::where('status', 'active')
            ->with(['category', 'variants', 'images'])
            ->get());
    }
}