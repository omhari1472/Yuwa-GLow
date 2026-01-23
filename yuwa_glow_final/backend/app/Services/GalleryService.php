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
            return Gallery::create($data);
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
