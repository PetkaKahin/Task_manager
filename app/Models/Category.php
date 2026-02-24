<?php

namespace App\Models;

use AlexCrawford\Sortable\SortableTrait;
use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @method static CategoryFactory factory($count = null, $state = [])
 */
class Category extends Model
{
    use HasFactory, SoftDeletes, SortableTrait;

    protected $fillable = [
        'title',
        'project_id',
        'position',
    ];

    //сортировать категории независимо внутри каждого проекта
    //ДОЛЖНО БЫТЬ ОБЯЗАТЕЛЬНО ДЛЯ alexcrawford/lexorank-sortable
    protected static $sortableGroupField = 'project_id';

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
