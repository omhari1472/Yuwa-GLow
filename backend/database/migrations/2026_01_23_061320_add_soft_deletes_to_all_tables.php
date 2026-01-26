<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'product_categories', 'products', 'product_variants', 
            'product_images', 'gallery', 'blogs', 
            'careers', 'applications', 'contact_enquiries'
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        $tables = [
            'product_categories', 'products', 'product_variants', 
            'product_images', 'gallery', 'blogs', 
            'careers', 'applications', 'contact_enquiries'
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};