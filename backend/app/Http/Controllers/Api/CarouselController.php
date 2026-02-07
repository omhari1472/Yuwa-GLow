<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCarouselRequest;
use App\Http\Requests\UpdateCarouselRequest;
use App\Models\Carousel;
use App\Services\CarouselService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CarouselController extends Controller
{
    use ApiResponse;

    protected $carouselService;

    public function __construct(CarouselService $carouselService)
    {
        $this->carouselService = $carouselService;
    }

    public function index(Request $request)
    {
        // If not authenticated (public), only show active items
        if (!$request->user()) {
            return $this->successResponse(
                Carousel::active()
                    ->ordered()
                    ->get()
            );
        }

        // Admin sees all items
        return $this->successResponse(Carousel::ordered()->get());
    }

    public function store(StoreCarouselRequest $request)
    {
        try {
            $carousel = $this->carouselService->createCarousel(
                $request->validated(),
                $request->file('image'),
                $request->file('mobile_image')
            );
            return $this->successResponse($carousel, 'Carousel image added', 201);
        } catch (\Exception $e) {
            \Log::error('Carousel Store Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to add carousel image.');
        }
    }

    public function show(Carousel $carousel)
    {
        return $this->successResponse($carousel);
    }

    public function update(UpdateCarouselRequest $request, Carousel $carousel)
    {
        try {
            $updated = $this->carouselService->updateCarousel(
                $carousel,
                $request->validated(),
                $request->file('image'),
                $request->file('mobile_image')
            );
            return $this->successResponse($updated, 'Carousel image updated');
        } catch (\Exception $e) {
            \Log::error('Carousel Update Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update carousel image.');
        }
    }

    public function destroy(Carousel $carousel)
    {
        $this->carouselService->deleteCarousel($carousel);
        return $this->successResponse([], 'Carousel image deleted');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:carousel,id',
        ]);

        try {
            $this->carouselService->reorder($request->order);
            return $this->successResponse([], 'Carousel order updated');
        } catch (\Exception $e) {
            \Log::error('Carousel Reorder Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update carousel order.');
        }
    }
}
