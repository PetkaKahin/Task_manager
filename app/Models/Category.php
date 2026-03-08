<?php

declare(strict_types=1);

namespace App\Models;

use AlexCrawford\Sortable\SortableTrait;
use App\Builders\SortableBuilder;
use App\Observers\CategoryObserver;
use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\Builder;

/**
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property int $project_id
 * @property string $position
 * @property Project $project
 *
 * @method void moveBefore(Category $entity)
 * @method void moveAfter(Category $entity)
 * @method static SortableBuilder<static> sorted()
 * @method static CategoryFactory factory($count = null, $state = [])
 *
 * @use HasFactory<CategoryFactory>
 */
#[ObservedBy(CategoryObserver::class)]
class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory;
    use SoftDeletes;
    use SortableTrait;

    protected $fillable = [
        'title',
        'project_id',
        'position',
    ];

    protected $casts = [
        'project_id' => 'int',
    ];

    //сортировать категории независимо внутри каждого проекта
    //ДОЛЖНО БЫТЬ ОБЯЗАТЕЛЬНО ДЛЯ alexcrawford/lexorank-sortable
    protected static string $sortableGroupField = 'project_id';

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

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** @return HasMany<Task, $this> */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}