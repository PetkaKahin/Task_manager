<?php

namespace App\Models;

use AlexCrawford\Sortable\SortableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes, SortableTrait;

    protected $casts = [
        'description' => 'array',
    ];

    protected $fillable = [
        'title',
        'content',
        'category_id',
        'position',
    ];

    public function category(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }
}
