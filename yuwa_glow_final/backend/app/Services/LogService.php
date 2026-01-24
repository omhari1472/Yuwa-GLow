<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class LogService
{
    /**
     * Log an API request
     */
    public static function apiRequest(string $action, array $context = []): void
    {
        Log::channel('api')->info("API Request: {$action}", array_merge([
            'user_id' => auth()->id(),
            'ip' => request()->ip(),
            'url' => request()->fullUrl(),
            'method' => request()->method(),
        ], $context));
    }

    /**
     * Log an API error
     */
    public static function apiError(string $action, \Throwable $e, array $context = []): void
    {
        Log::channel('api')->error("API Error: {$action}", array_merge([
            'message' => $e->getMessage(),
            'exception' => get_class($e),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'user_id' => auth()->id(),
            'ip' => request()->ip(),
            'url' => request()->fullUrl(),
            'method' => request()->method(),
        ], $context));
    }

    /**
     * Log a successful operation
     */
    public static function success(string $action, array $context = []): void
    {
        Log::channel('api')->info("Success: {$action}", array_merge([
            'user_id' => auth()->id(),
        ], $context));
    }

    /**
     * Log a warning
     */
    public static function warning(string $action, array $context = []): void
    {
        Log::channel('api')->warning("Warning: {$action}", array_merge([
            'user_id' => auth()->id(),
            'ip' => request()->ip(),
        ], $context));
    }

    /**
     * Log security-related events
     */
    public static function security(string $action, array $context = []): void
    {
        Log::channel('api')->warning("Security: {$action}", array_merge([
            'user_id' => auth()->id(),
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
        ], $context));
    }

    /**
     * Log authentication events
     */
    public static function auth(string $action, array $context = []): void
    {
        Log::channel('api')->info("Auth: {$action}", array_merge([
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ], $context));
    }
}
