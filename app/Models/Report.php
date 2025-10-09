<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'generated_by',
        'summary',
        'metrics_json',
    ];

    protected $casts = [
        'metrics_json' => 'array',
    ];

    // === Relations ===
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function generatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
