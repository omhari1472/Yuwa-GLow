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

            // Handle Variants safely
            if (isset($data['variants']) && is_array($data['variants'])) {
                foreach ($data['variants'] as $variant) {
                    if (!empty($variant['variant_name'])) {
                        $product->variants()->create($variant);
                    }
                }
            }

            // Handle Images
            if (isset($data['images']) && is_array($data['images'])) {
                foreach ($data['images'] as $image) {
                    if ($image instanceof \Illuminate\Http\UploadedFile) {
                        $path = $this->fileUpload->upload($image, 'products');
                        $product->images()->create(['image_url' => $path]);
                    }
                }
            }

            return $product->load(['variants', 'images']);
        });
    }

    public function updateProduct(Product $product, array $data)
    {
        return DB::transaction(function () use ($product, $data) {
            $product->update([
                'category_id' => $data['category_id'] ?? $product->category_id,
                'name' => $data['name'] ?? $product->name,
                'description' => $data['description'] ?? $product->description,
                'price' => $data['price'] ?? $product->price,
                'status' => $data['status'] ?? $product->status,
            ]);

            // If new images are provided, append them
            if (isset($data['images']) && is_array($data['images'])) {
                foreach ($data['images'] as $image) {
                    if ($image instanceof \Illuminate\Http\UploadedFile) {
                        $path = $this->fileUpload->upload($image, 'products');
                        $product->images()->create(['image_url' => $path]);
                    }
                }
            }

            return $product->load(['variants', 'images']);
        });
    }

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