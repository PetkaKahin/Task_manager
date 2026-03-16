<?php

namespace App\Repositories;

use App\Builders\SortableBuilder;
use App\Models\Category;
use App\Models\Project;
use App\Models\Task;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function getByProject(Project $project): Collection
    {
        $raw = Cache::tags(["project:{$project->id}:categories"])
            ->remember(
                "project:{$project->id}:categories",
                now()->addHour(),
                fn () => Category::sorted()
                    ->where('project_id', $project->id)
                    ->with(['tasks' => function (mixed $query): void {
                        /** @var SortableBuilder<Task> $query */
                        $query->sorted();
                    }])
                    ->get()
                    ->map(fn (Category $category) => [
                        'attrs' => $category->getAttributes(),
                        'tasks' => $category->tasks->map->getAttributes()->toArray(),
                    ])
                    ->toArray()
            );

        return (new Category)->newCollection(
            array_map(function (array $item): Category {
                $category = (new Category)->newFromBuilder($item['attrs']);
                $category->setRelation('tasks', Task::hydrate($item['tasks']));

                return $category;
            }, $raw)
        );
    }

    public function findByProjectOrFail(Project $project, int $id): Category
    {
        return $project->categories()->findOrFail($id);
    }

    public function getFirstByProject(Project $project, int $excludeId): ?Category
    {
        return Category::sorted()
            ->where('project_id', $project->id)
            ->where('id', '!=', $excludeId)
            ->first();
    }

    public function create(array $data): Category
    {
        $category = Category::create($data);
        $this->clearProjectCache($category);

        return $category;
    }

    public function update(Category $category, array $data): Category
    {
        $category->update($data);
        $this->clearProjectCache($category);

        return $category;
    }

    public function delete(Category $category): void
    {
        $category->delete();
        $this->clearProjectCache($category);
    }

    public function clearProjectCache(Category $category): void
    {
        Cache::tags(["project:{$category->project_id}:categories"])->flush();
    }

    public function getProjectId(int $categoryId): ?int
    {
        /** @var int|null */
        return Cache::remember(
            "category:{$categoryId}:project_id",
            now()->addDay(),
            fn () => Category::query()->where('id', $categoryId)->value('project_id')
        );
    }
}