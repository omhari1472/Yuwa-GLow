<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Career extends Model
{
    protected $fillable = [
        'title',
        'department',
        'location',
        'description',
        'status',
    ];

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'career_id');
    }
}