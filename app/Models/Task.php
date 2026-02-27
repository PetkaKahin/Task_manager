<?php

namespace App\Models;

use AlexCrawford\Sortable\SortableTrait;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @method static TaskFactory factory($count = null, $state = [])
 */
class Task extends Model
{
    use HasFactory, SoftDeletes, SortableTrait;

    //сортировать категории независимо внутри каждой категории
    //ДОЛЖНО БЫТЬ ОБЯЗАТЕЛЬНО ДЛЯ alexcrawford/lexorank-sortable
    protected static $sortableGroupField = 'category_id';

    protected $fillable = [
        'content',
        'category_id',
        'position',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
