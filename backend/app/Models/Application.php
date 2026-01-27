<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    protected $fillable = [
        'application_type',
        'name',
        'email',
        'phone',
        'company_name',
        'career_id',
        'resume_url',
        'state',
        'district',
        'address',
        'photo_url',
        'status',
    ];

    public function career(): BelongsTo
    {
        return $this->belongsTo(Career::class, 'career_id');
    }
}