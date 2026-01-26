<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->enum('application_type', ['career', 'super_stockist', 'distributor']);
            
            // Common fields
            $table->string('name', 150);
            $table->string('email', 150);
            $table->string('phone', 20);

            // Career-specific
            $table->foreignId('career_id')->nullable()->constrained('careers')->onDelete('cascade');
            $table->string('resume_url', 255)->nullable();

            // Distributor / Stockist-specific
            $table->string('state', 100)->nullable();
            $table->string('district', 100)->nullable();
            $table->text('address')->nullable();

            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};