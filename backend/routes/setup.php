<?php

/**
 * TEMPORARY SETUP ROUTES - DELETE AFTER DEPLOYMENT
 * Access these at: https://yuvaglow.com/api/setup/...
 */

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\AdminUser;

// Security: Only allow setup if no admin users exist OR with secret key
$setupKey = 'yuva2024setup'; // Change this to something random

Route::prefix('setup')->group(function () use ($setupKey) {

    // Step 1: Test database connection
    Route::get('/test-db', function () {
        try {
            DB::connection()->getPdo();
            return response()->json([
                'success' => true,
                'message' => 'Database connection successful!',
                'database' => DB::connection()->getDatabaseName()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database connection failed',
                'error' => $e->getMessage()
            ], 500);
        }
    });

    // Step 2: Run migrations
    Route::get('/migrate/{key}', function ($key) use ($setupKey) {
        if ($key !== $setupKey) {
            return response()->json(['error' => 'Invalid setup key'], 403);
        }

        try {
            Artisan::call('migrate', ['--force' => true]);
            $output = Artisan::output();

            return response()->json([
                'success' => true,
                'message' => 'Migrations completed!',
                'output' => $output
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Migration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    });

    // Step 3: Create storage symlink
    Route::get('/storage-link/{key}', function ($key) use ($setupKey) {
        if ($key !== $setupKey) {
            return response()->json(['error' => 'Invalid setup key'], 403);
        }

        try {
            Artisan::call('storage:link');
            return response()->json([
                'success' => true,
                'message' => 'Storage link created!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Storage link failed',
                'error' => $e->getMessage()
            ], 500);
        }
    });

    // Step 4: Create admin user
    Route::get('/create-admin/{key}', function ($key) use ($setupKey) {
        if ($key !== $setupKey) {
            return response()->json(['error' => 'Invalid setup key'], 403);
        }

        try {
            // Check if admin already exists
            if (AdminUser::count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin user already exists!'
                ]);
            }

            $admin = AdminUser::create([
                'name' => 'Admin',
                'email' => 'admin@yuvaglow.com',
                'password' => Hash::make('YuvaGlow@2024')
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Admin user created!',
                'credentials' => [
                    'email' => 'admin@yuvaglow.com',
                    'password' => 'YuvaGlow@2024',
                    'note' => 'CHANGE THIS PASSWORD IMMEDIATELY!'
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create admin',
                'error' => $e->getMessage()
            ], 500);
        }
    });

    // Step 5: Clear all caches
    Route::get('/clear-cache/{key}', function ($key) use ($setupKey) {
        if ($key !== $setupKey) {
            return response()->json(['error' => 'Invalid setup key'], 403);
        }

        try {
            Artisan::call('config:clear');
            Artisan::call('cache:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');

            return response()->json([
                'success' => true,
                'message' => 'All caches cleared!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    });

    // Full setup - run all steps
    Route::get('/run-all/{key}', function ($key) use ($setupKey) {
        if ($key !== $setupKey) {
            return response()->json(['error' => 'Invalid setup key'], 403);
        }

        $results = [];

        // Test DB
        try {
            DB::connection()->getPdo();
            $results['database'] = 'Connected to: ' . DB::connection()->getDatabaseName();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'step' => 'database',
                'error' => $e->getMessage()
            ], 500);
        }

        // Migrate
        try {
            Artisan::call('migrate', ['--force' => true]);
            $results['migrations'] = 'Completed';
        } catch (\Exception $e) {
            $results['migrations'] = 'Failed: ' . $e->getMessage();
        }

        // Storage link
        try {
            Artisan::call('storage:link');
            $results['storage_link'] = 'Created';
        } catch (\Exception $e) {
            $results['storage_link'] = 'Failed (may already exist): ' . $e->getMessage();
        }

        // Create admin
        try {
            if (AdminUser::count() === 0) {
                AdminUser::create([
                    'name' => 'Admin',
                    'email' => 'admin@yuvaglow.com',
                    'password' => Hash::make('YuvaGlow@2024')
                ]);
                $results['admin'] = [
                    'status' => 'Created',
                    'email' => 'admin@yuvaglow.com',
                    'password' => 'YuvaGlow@2024',
                    'note' => 'CHANGE THIS PASSWORD IMMEDIATELY!'
                ];
            } else {
                $results['admin'] = 'Already exists';
            }
        } catch (\Exception $e) {
            $results['admin'] = 'Failed: ' . $e->getMessage();
        }

        // Clear caches
        try {
            Artisan::call('config:clear');
            Artisan::call('cache:clear');
            $results['cache'] = 'Cleared';
        } catch (\Exception $e) {
            $results['cache'] = 'Failed: ' . $e->getMessage();
        }

        return response()->json([
            'success' => true,
            'message' => 'Setup completed!',
            'results' => $results,
            'next_steps' => [
                '1. Delete this setup.php file from routes/',
                '2. Remove the require line from routes/web.php',
                '3. Change your admin password immediately',
                '4. Test your site!'
            ]
        ]);
    });
});
