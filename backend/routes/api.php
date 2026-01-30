<?php

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\CareerController;
use App\Http\Controllers\Api\CarouselController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactEnquiryController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TransformationController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

// Public visibility routes
Route::get('/products/active', [ProductController::class, 'getActive']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories/active', [CategoryController::class, 'getActive']);
Route::get('/blogs/published', [BlogController::class, 'getPublished']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);
Route::get('/careers/open', [CareerController::class, 'getOpen']);
Route::get('/careers/{career}', [CareerController::class, 'show']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/carousel', [CarouselController::class, 'index']);
Route::get('/transformations', [TransformationController::class, 'index']);
Route::get('/partners/availability', [ApplicationController::class, 'checkAvailability']);
Route::get('/distributors', [ApplicationController::class, 'getApproved'])->defaults('type', 'distributor');
Route::get('/stockists', [ApplicationController::class, 'getApproved'])->defaults('type', 'super_stockist');

// Public Form Submissions
Route::post('/enquire', [ContactEnquiryController::class, 'store']);
Route::post('/apply', [ApplicationController::class, 'store']);

// Protected Admin Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::get('/dashboard/stats', [\App\Http\Controllers\Api\DashboardController::class, 'index']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Category Management
    Route::apiResource('categories', CategoryController::class);

    // Product Management
    Route::apiResource('products', ProductController::class)->except(['show']);
    Route::delete('products/{product}/variants/{variant}', [ProductController::class, 'deleteVariant']);
    Route::delete('products/{product}/images/{image}', [ProductController::class, 'deleteImage']);

    // Gallery Management
    Route::apiResource('gallery', GalleryController::class)->except(['index', 'show']);
    Route::post('gallery/{gallery}', [GalleryController::class, 'update']); // POST for file uploads

    // Carousel Management
    Route::post('carousel/reorder', [CarouselController::class, 'reorder']);
    Route::apiResource('carousel', CarouselController::class)->except(['index']);
    Route::post('carousel/{carousel}', [CarouselController::class, 'update']); // POST for file uploads

    // Transformations Management
    Route::post('transformations/reorder', [TransformationController::class, 'reorder']);
    Route::apiResource('transformations', TransformationController::class)->except(['index']);
    Route::post('transformations/{transformation}', [TransformationController::class, 'update']); // POST for file uploads

    // Blog Management
    Route::apiResource('blogs', BlogController::class)->except(['show']);

    // Career Management
    Route::apiResource('careers', CareerController::class)->except(['show']);

    // Applications & Enquiries
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy']);
    
    Route::get('/enquiries', [ContactEnquiryController::class, 'index']);
    Route::post('/enquiries/{contactEnquiry}/reply', [ContactEnquiryController::class, 'reply']);
    Route::patch('/enquiries/{contactEnquiry}/status', [ContactEnquiryController::class, 'updateStatus']);
    Route::delete('/enquiries/{contactEnquiry}', [ContactEnquiryController::class, 'destroy']);
});