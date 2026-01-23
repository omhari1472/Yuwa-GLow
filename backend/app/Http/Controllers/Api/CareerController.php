<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Career;
use Illuminate\Http\Request;

class CareerController extends Controller
{
    public function index(Request $request)
    {
        $query = Career::query();
        if (!$request->user()) {
            $query->where('status', 'open');
        }
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'department' => 'required|string|max:100',
            'location' => 'required|string|max:100',
            'description' => 'required|string',
            'status' => 'nullable|in:open,closed',
        ]);

        $career = Career::create($validated);

        return response()->json($career, 201);
    }

    public function show(Career $career)
    {
        return response()->json($career);
    }

    public function update(Request $request, Career $career)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'department' => 'required|string|max:100',
            'location' => 'required|string|max:100',
            'description' => 'required|string',
            'status' => 'nullable|in:open,closed',
        ]);

        $career->update($validated);

        return response()->json($career);
    }

    public function destroy(Career $career)
    {
        $career->delete();
        return response()->json(['message' => 'Job posting deleted successfully']);
    }
}