<?php

namespace App\Services;

use App\Models\Carousel;
use Illuminate\Support\Facades\DB;

class CarouselService
{
    protected $fileUpload;

    public function __construct(FileUploadService $fileUpload)
    {
        $this->fileUpload = $fileUpload;
    }

    public function createCarousel(array $data, $file = null)
    {
        return DB::transaction(function () use ($data, $file) {
            if ($file) {
                $data['image_url'] = $this->fileUpload->upload($file, 'carousel');
            }

            // Set default sort_order to be at the end
            if (!isset($data['sort_order'])) {
                $maxOrder = Carousel::max('sort_order') ?? 0;
                $data['sort_order'] = $maxOrder + 1;
            }

            // Set default status if not provided
            $data['status'] = $data['status'] ?? 'active';

            return Carousel::create($data);
        });
    }

    public function updateCarousel(Carousel $carousel, array $data, $file = null)
    {
        return DB::transaction(function () use ($carousel, $data, $file) {
            $updateData = [
                'sort_order' => $data['sort_order'] ?? $carousel->sort_order,
                'status' => $data['status'] ?? $carousel->status,
            ];

            // If new image uploaded, delete old one and upload new
            if ($file) {
                $this->fileUpload->delete($carousel->image_url);
                $updateData['image_url'] = $this->fileUpload->upload($file, 'carousel');
            }

            $carousel->update($updateData);
            return $carousel->fresh();
        });
    }

    public function deleteCarousel(Carousel $carousel)
    {
        $this->fileUpload->delete($carousel->image_url);
        return $carousel->delete();
    }

    public function reorder(array $orderedIds)
    {
        return DB::transaction(function () use ($orderedIds) {
            foreach ($orderedIds as $index => $id) {
                Carousel::where('id', $id)->update(['sort_order' => $index]);
            }
            return true;
        });
    }
}
