<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService
{
    protected $fileUpload;

    public function __construct(FileUploadService $fileUpload)
    {
        $this->fileUpload = $fileUpload;
    }

    /**
     * Create a new product with variants and images.
     */
    public function createProduct(array $data)
    {
        return DB::transaction(function () use ($data) {
            $product = Product::create([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'price' => $data['price'],
                'status' => $data['status'] ?? 'active',
            ]);

            // Handle Variants
            if (!empty($data['variants'])) {
                foreach ($data['variants'] as $variant) {
                    $product->variants()->create($variant);
                }
            }

            // Handle Images
            if (!empty($data['images'])) {
                foreach ($data['images'] as $image) {
                    $path = $this->fileUpload->upload($image, 'products');
                    $product->images()->create(['image_url' => $path]);
                }
            }

            return $product->load(['variants', 'images']);
        });
    }

    /**
     * Update an existing product.
     */
    public function updateProduct(Product $product, array $data)
    {
        return DB::transaction(function () use ($product, $data) {
            $product->update([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'price' => $data['price'],
                'status' => $data['status'] ?? $product->status,
            ]);

            return $product->load(['variants', 'images']);
        });
    }

    /**
     * Delete a product and its associated files.
     */
    public function deleteProduct(Product $product)
    {
        return DB::transaction(function () use ($product) {
            foreach ($product->images as $image) {
                $this->fileUpload->delete($image->image_url);
            }
            return $product->delete();
        });
    }
}
