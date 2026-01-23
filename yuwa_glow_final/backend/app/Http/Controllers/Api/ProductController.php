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
        $request->validate([
            'category_id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:150',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'status' => 'nullable|in:active,inactive',
        ]);

        try {
            // Force wrap single image/variant if they come as non-arrays
            $data = $request->all();
            if ($request->hasFile('images') && !is_array($data['images'])) {
                $data['images'] = [$data['images']];
            }

            $product = $this->productService->createProduct($data);
            return $this->successResponse($product, 'Product created successfully', 201);
        } catch (\Exception $e) {
            \Log::error('Product Store Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to create product: ' . $e->getMessage());
        }
    }

    public function show(Product $product)
    {
        return $this->successResponse($product->load(['category', 'variants', 'images']));
    }

    public function update(Request $request, Product $product)
    {
        try {
            $data = $request->all();
            $updatedProduct = $this->productService->updateProduct($product, $data);
            return $this->successResponse($updatedProduct, 'Product updated successfully');
        } catch (\Exception $e) {
            \Log::error('Product Update Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update product: ' . $e->getMessage());
        }
    }

    public function destroy(Product $product)
    {
        try {
            $this->productService->deleteProduct($product);
            return $this->successResponse([], 'Product deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete product.');
        }
    }
}