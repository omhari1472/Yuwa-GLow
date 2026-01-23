<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index()
    {
        $products = Product::with(['category', 'variants', 'images'])->get();
        return $this->successResponse($products);
    }

    public function getActive()
    {
        $products = Product::where('status', 'active')
            ->with(['category', 'variants', 'images'])
            ->get();
        return $this->successResponse($products);
    }

    public function store(Request $request)
    {
        // Validation could be moved to ProductRequest as well
        $validated = $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:150',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'status' => 'nullable|in:active,inactive',
            'variants' => 'nullable|array',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048'
        ]);

        try {
            $product = $this->productService.createProduct($request->all());
            return $this->successResponse($product, 'Product created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create product: ' . $e->getMessage());
        }
    }

    public function show(Product $product)
    {
        return $this->successResponse($product->load(['category', 'variants', 'images']));
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

        try {
            $updatedProduct = $this->productService.updateProduct($product, $request->all());
            return $this->successResponse($updatedProduct, 'Product updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update product: ' . $e->getMessage());
        }
    }

    public function destroy(Product $product)
    {
        try {
            $this->productService.deleteProduct($product);
            return $this->successResponse([], 'Product deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete product.');
        }
    }
}
