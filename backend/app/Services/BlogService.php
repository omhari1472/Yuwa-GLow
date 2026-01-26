<?php

namespace App\Services;

use App\Models\Blog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BlogService
{
    protected $fileUpload;

    public function __construct(FileUploadService $fileUpload)
    {
        $this->fileUpload = $fileUpload;
    }

    public function createBlog(array $data)
    {
        return DB::transaction(function () use ($data) {
            if (isset($data['featured_image'])) {
                $data['featured_image'] = $this->fileUpload->upload($data['featured_image'], 'blogs');
            }

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            return Blog::create($data);
        });
    }

    public function updateBlog(Blog $blog, array $data)
    {
        return DB::transaction(function () use ($blog, $data) {
            if (isset($data['featured_image'])) {
                $this->fileUpload->delete($blog->featured_image);
                $data['featured_image'] = $this->fileUpload->upload($data['featured_image'], 'blogs');
            }

            if (!empty($data['title']) && (empty($data['slug']) || $data['slug'] === $blog->slug)) {
                $data['slug'] = Str::slug($data['title']);
            }

            $blog->update($data);
            return $blog;
        });
    }

    public function deleteBlog(Blog $blog)
    {
        $this->fileUpload->delete($blog->featured_image);
        return $blog->delete();
    }
}
