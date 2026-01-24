<?php

namespace App\Services;

use App\Models\Gallery;
use Illuminate\Support\Facades\DB;

class GalleryService
{
    protected $fileUpload;

    public function __construct(FileUploadService $fileUpload)
    {
        $this->fileUpload = $fileUpload;
    }

    public function createGallery(array $data, $file = null)
    {
        return DB::transaction(function () use ($data, $file) {
            if ($data['type'] === 'image' && $file) {
                $data['media_url'] = $this->fileUpload->upload($file, 'gallery');
            }
            // Set default status if not provided
            $data['status'] = $data['status'] ?? 'published';
            return Gallery::create($data);
        });
    }

    public function updateGallery(Gallery $gallery, array $data, $file = null)
    {
        return DB::transaction(function () use ($gallery, $data, $file) {
            $updateData = [
                'title' => $data['title'] ?? $gallery->title,
                'status' => $data['status'] ?? $gallery->status,
            ];

            // If type is changing or a new file is uploaded
            if (isset($data['type'])) {
                $updateData['type'] = $data['type'];

                if ($data['type'] === 'video') {
                    // Switching to video - delete old image if exists
                    if ($gallery->type === 'image') {
                        $this->fileUpload->delete($gallery->media_url);
                    }
                    $updateData['media_url'] = $data['media_url'] ?? $gallery->media_url;
                } elseif ($data['type'] === 'image' && $file) {
                    // New image uploaded - delete old one if it was an image
                    if ($gallery->type === 'image') {
                        $this->fileUpload->delete($gallery->media_url);
                    }
                    $updateData['media_url'] = $this->fileUpload->upload($file, 'gallery');
                }
            } elseif ($file && $gallery->type === 'image') {
                // Just updating the image
                $this->fileUpload->delete($gallery->media_url);
                $updateData['media_url'] = $this->fileUpload->upload($file, 'gallery');
            } elseif (isset($data['media_url']) && $gallery->type === 'video') {
                $updateData['media_url'] = $data['media_url'];
            }

            $gallery->update($updateData);
            return $gallery->fresh();
        });
    }

    public function deleteGallery(Gallery $gallery)
    {
        if ($gallery->type === 'image') {
            $this->fileUpload->delete($gallery->media_url);
        }
        return $gallery->delete();
    }
}
