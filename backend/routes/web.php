<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/debug-routes', function () {
    $routes = collect(Route::getRoutes())->map(function ($route) {
        return [
            'uri' => $route->uri(),
            'methods' => $route->methods(),
        ];
    });
    return response()->json($routes);
});

Route::fallback(function () {
    return response()->json([
        'message' => 'Route not found',
        'requested_uri' => request()->getRequestUri(),
        'path' => request()->path(),
        'base_url' => request()->getBaseUrl(),
    ], 404);
});
