<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index()
    {
        return response()->json(Gallery::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'type' => 'required|in:image,video',
            'media_url' => 'required_if:type,video|nullable|url',
            'image' => 'required_if:type,image|nullable|image|max:5120' // 5MB max
        ]);

        $data = $request->only(['title', 'type']);

        if ($request->type === 'image' && $request->hasFile('image')) {
            $data['media_url'] = $request->file('image')->store('gallery', 'public');
        } else {
            $data['media_url'] = $request->media_url;
        }

        $gallery = Gallery::create($data);

        return response()->json($gallery, 201);
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->type === 'image') {
            Storage::disk('public')->delete($gallery->media_url);
        }
        $gallery->delete();
        return response()->json(['message' => 'Media deleted successfully']);
    }
}