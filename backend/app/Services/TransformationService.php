<?php

namespace App\Services;

use App\Models\Transformation;
use Illuminate\Support\Facades\DB;

class TransformationService
{
    protected $fileUpload;

    public function __construct(FileUploadService $fileUpload)
    {
        $this->fileUpload = $fileUpload;
    }

    public function createTransformation(array $data, $beforeImage = null, $afterImage = null)
    {
        return DB::transaction(function () use ($data, $beforeImage, $afterImage) {
            if ($beforeImage) {
                $data['before_image'] = $this->fileUpload->upload($beforeImage, 'transformations');
            }

            if ($afterImage) {
                $data['after_image'] = $this->fileUpload->upload($afterImage, 'transformations');
            }

            // Set default sort_order to be at the end
            if (!isset($data['sort_order'])) {
                $maxOrder = Transformation::max('sort_order') ?? 0;
                $data['sort_order'] = $maxOrder + 1;
            }

            // Set default status if not provided
            $data['status'] = $data['status'] ?? 'draft';

            return Transformation::create($data);
        });
    }

    public function updateTransformation(Transformation $transformation, array $data, $beforeImage = null, $afterImage = null)
    {
        return DB::transaction(function () use ($transformation, $data, $beforeImage, $afterImage) {
            $updateData = [
                'title' => $data['title'] ?? $transformation->title,
                'description' => $data['description'] ?? $transformation->description,
                'sort_order' => $data['sort_order'] ?? $transformation->sort_order,
                'status' => $data['status'] ?? $transformation->status,
            ];

            // If new before image uploaded, delete old one and upload new
            if ($beforeImage) {
                $this->fileUpload->delete($transformation->before_image);
                $updateData['before_image'] = $this->fileUpload->upload($beforeImage, 'transformations');
            }

            // If new after image uploaded, delete old one and upload new
            if ($afterImage) {
                $this->fileUpload->delete($transformation->after_image);
                $updateData['after_image'] = $this->fileUpload->upload($afterImage, 'transformations');
            }

            $transformation->update($updateData);
            return $transformation->fresh();
        });
    }

    public function deleteTransformation(Transformation $transformation)
    {
        $this->fileUpload->delete($transformation->before_image);
        $this->fileUpload->delete($transformation->after_image);
        return $transformation->delete();
    }

    public function reorder(array $orderedIds)
    {
        return DB::transaction(function () use ($orderedIds) {
            foreach ($orderedIds as $index => $id) {
                Transformation::where('id', $id)->update(['sort_order' => $index]);
            }
            return true;
        });
    }
}
