<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    /**
     * Upload a file to a specific disk and directory.
     * Automatically converts images to WebP format for better performance.
     *
     * @param int $quality  WebP quality 1-100 (default 80, use 90+ for hero/carousel)
     * @param int $maxWidth Max pixel width before resize (default 1920)
     */
    public function upload(UploadedFile $file, string $directory, string $disk = 'public', int $quality = 80, int $maxWidth = 1920): string
    {
        // Check if it's an image that can be converted to WebP
        $mimeType = $file->getMimeType();
        $imageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        // Only convert if GD supports WebP
        if (in_array($mimeType, $imageTypes) && function_exists('imagewebp')) {
            return $this->uploadAndConvertToWebp($file, $directory, $disk, $quality, $maxWidth);
        }

        // For non-image files or if WebP not supported, store as-is
        return $file->store($directory, $disk);
    }

    /**
     * Convert image to WebP format and upload using GD library.
     */
    protected function uploadAndConvertToWebp(UploadedFile $file, string $directory, string $disk = 'public', int $quality = 80, int $maxWidth = 1920): string
    {
        $mimeType = $file->getMimeType();
        $sourcePath = $file->getPathname();

        // Create image resource based on type
        switch ($mimeType) {
            case 'image/jpeg':
                $image = imagecreatefromjpeg($sourcePath);
                break;
            case 'image/png':
                $image = imagecreatefrompng($sourcePath);
                // Preserve transparency
                imagepalettetotruecolor($image);
                imagealphablending($image, true);
                imagesavealpha($image, true);
                break;
            case 'image/gif':
                $image = imagecreatefromgif($sourcePath);
                break;
            default:
                return $file->store($directory, $disk);
        }

        if (!$image) {
            return $file->store($directory, $disk);
        }

        // Resize if too large
        $width = imagesx($image);
        $height = imagesy($image);

        if ($width > $maxWidth) {
            $newHeight = (int) ($height * ($maxWidth / $width));
            $resized = imagecreatetruecolor($maxWidth, $newHeight);

            // Preserve transparency for PNG
            if ($mimeType === 'image/png') {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
                $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
                imagefill($resized, 0, 0, $transparent);
            }

            imagecopyresampled($resized, $image, 0, 0, 0, 0, $maxWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resized;
        }

        // Generate filename with .webp extension
        $filename = pathinfo($file->hashName(), PATHINFO_FILENAME) . '.webp';
        $path = $directory . '/' . $filename;

        // Create temp file for WebP
        $tempPath = sys_get_temp_dir() . '/' . $filename;

        // Convert to WebP
        imagewebp($image, $tempPath, $quality);
        imagedestroy($image);

        // Store the WebP image
        Storage::disk($disk)->put($path, file_get_contents($tempPath));

        // Clean up temp file
        unlink($tempPath);

        return $path;
    }

    /**
     * Delete a file from storage.
     */
    public function delete(?string $path, string $disk = 'public'): bool
    {
        if ($path && Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }
        return false;
    }
}
