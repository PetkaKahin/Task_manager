<?php

declare(strict_types=1);

namespace App\Models;

use AlexCrawford\Sortable\SortableTrait;
use App\Builders\SortableBuilder;
use App\Observers\TaskObserver;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\Builder;

/**
 * @property int $id
 * @property array<string, mixed> $content
 * @property int $category_id
 * @property string $position
 * @property Category $category
 *
 * @method void moveBefore(Task $entity)
 * @method void moveAfter(Task $entity)
 * @method static SortableBuilder<static> sorted()
 * @method static TaskFactory factory($count = null, $state = [])
 *
 * @use HasFactory<TaskFactory>
 */
#[ObservedBy(TaskObserver::class)]
class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory;
    use SoftDeletes;
    use SortableTrait;

    //сортировать таски независимо внутри каждой категории
    //ДОЛЖНО БЫТЬ ОБЯЗАТЕЛЬНО ДЛЯ alexcrawford/lexorank-sortable
    protected static string $sortableGroupField = 'category_id';

    protected $fillable = [
        'content',
        'category_id',
        'position',
    ];

    protected $casts = [
        'content'     => 'json',
        'category_id' => 'int',
    ];

    /**
     * @param  Builder  $query
     * @return SortableBuilder<static>
     */
    public function newEloquentBuilder($query): SortableBuilder
    {
        /** @var SortableBuilder<static> $builder */
        $builder = new SortableBuilder($query);

        return $builder;
    }

    /** @return BelongsTo<Category, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}