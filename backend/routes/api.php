<?php

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\CareerController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactEnquiryController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

// Public visibility routes
Route::get('/products/active', [ProductController::class, 'getActive']);
Route::get('/categories/active', [CategoryController::class, 'getActive']);
Route::get('/blogs', [BlogController::class, 'index']); // Filtered to published in controller
Route::get('/blogs/{slug}', [BlogController::class, 'show']);
Route::get('/careers', [CareerController::class, 'index']); // Filtered to open in controller
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/distributors', [ApplicationController::class, 'getApproved'])->defaults('type', 'distributor');
Route::get('/stockists', [ApplicationController::class, 'getApproved'])->defaults('type', 'super_stockist');

// Public Form Submissions
Route::post('/enquire', [ContactEnquiryController::class, 'store']);
Route::post('/apply', [ApplicationController::class, 'store']);

// Protected Admin Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Category Management
    Route::apiResource('categories', CategoryController::class);

    // Product Management
    Route::apiResource('products', ProductController::class);

    // Gallery Management
    Route::apiResource('gallery', GalleryController::class)->except(['index', 'update', 'show']);

    // Blog Management
    Route::apiResource('blogs', BlogController::class)->except(['index', 'show']);

    // Career Management
    Route::apiResource('careers', CareerController::class)->except(['index']);

    // Applications & Enquiries
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy']);
    
    Route::get('/enquiries', [ContactEnquiryController::class, 'index']);
    Route::delete('/enquiries/{contactEnquiry}', [ContactEnquiryController::class, 'destroy']);
});