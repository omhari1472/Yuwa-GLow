<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Blog;
use App\Models\ContactEnquiry;
use App\Models\Product;

class DashboardService
{
    /**
     * Get statistics for the admin dashboard.
     */
    public function getStats(): array
    {
        return [
            'total_products' => Product::count(),
            'total_blogs' => Blog::count(),
            'pending_applications' => Application::where('status', 'pending')->count(),
            'recent_enquiries' => ContactEnquiry::orderBy('created_at', 'desc')->limit(5)->get(),
            'active_distributors' => Application::where('application_type', 'distributor')->where('status', 'approved')->count(),
            'active_stockists' => Application::where('application_type', 'super_stockist')->where('status', 'approved')->count(),
        ];
    }
}
