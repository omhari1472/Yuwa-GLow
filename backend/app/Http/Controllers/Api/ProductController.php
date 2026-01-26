<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
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

    public function store(StoreProductRequest $request)
    {
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

    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            $data = $request->validated();
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

    public function deleteVariant(Product $product, $variantId)
    {
        try {
            $this->productService->deleteVariant($product, $variantId);
            return $this->successResponse([], 'Variant deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete variant.');
        }
    }

    public function deleteImage(Product $product, $imageId)
    {
        try {
            $this->productService->deleteImage($product, $imageId);
            return $this->successResponse([], 'Image deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete image.');
        }
    }
}