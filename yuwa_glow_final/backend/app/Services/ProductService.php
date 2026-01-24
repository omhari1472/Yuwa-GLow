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

            // Handle Variants - parse JSON if string
            $variants = $data['variants'] ?? [];
            if (is_string($variants)) {
                $variants = json_decode($variants, true) ?? [];
            }
            if (is_array($variants)) {
                foreach ($variants as $variant) {
                    if (!empty($variant['variant_name'])) {
                        $product->variants()->create([
                            'variant_name' => $variant['variant_name'],
                            'variant_value' => $variant['variant_value'] ?? null,
                            'price' => $variant['price'] ?? $data['price'],
                        ]);
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

            // Handle variant updates if provided - parse JSON if string
            $variants = $data['variants'] ?? null;
            if (is_string($variants)) {
                $variants = json_decode($variants, true);
            }
            if (is_array($variants)) {
                $this->syncVariants($product, $variants);
            }

            return $product->load(['variants', 'images']);
        });
    }

    public function syncVariants(Product $product, array $variants)
    {
        $existingIds = [];

        foreach ($variants as $variantData) {
            if (empty($variantData['variant_name'])) continue;

            if (!empty($variantData['id'])) {
                // Update existing variant
                $variant = $product->variants()->find($variantData['id']);
                if ($variant) {
                    $variant->update([
                        'variant_name' => $variantData['variant_name'],
                        'variant_value' => $variantData['variant_value'] ?? null,
                        'price' => $variantData['price'] ?? $product->price,
                    ]);
                    $existingIds[] = $variant->id;
                }
            } else {
                // Create new variant
                $newVariant = $product->variants()->create([
                    'variant_name' => $variantData['variant_name'],
                    'variant_value' => $variantData['variant_value'] ?? null,
                    'price' => $variantData['price'] ?? $product->price,
                ]);
                $existingIds[] = $newVariant->id;
            }
        }

        // Delete variants that were removed
        $product->variants()->whereNotIn('id', $existingIds)->delete();
    }

    public function deleteVariant(Product $product, int $variantId)
    {
        return $product->variants()->where('id', $variantId)->delete();
    }

    public function deleteImage(Product $product, int $imageId)
    {
        $image = $product->images()->find($imageId);
        if ($image) {
            $this->fileUpload->delete($image->image_url);
            return $image->delete();
        }
        return false;
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