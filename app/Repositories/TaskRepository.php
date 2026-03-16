<?php

namespace App\Repositories;

use App\Models\Category;
use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class TaskRepository implements TaskRepositoryInterface
{
    public function __construct(
        private readonly CategoryRepository $categoryRepository,
    ) {}

    public function find(int $id): ?Task
    {
        $raw = Cache::tags(["task:{$id}"])
            ->remember(
                "task:{$id}",
                now()->addHour(),
                fn () => Task::query()->find($id)?->getAttributes()
            );

        return $raw ? (new Task)->newFromBuilder($raw) : null;
    }

    public function create(array $data): Task
    {
        $task = Task::query()->create($data);
        $this->clearCategoryCache($task->category_id);

        return $task;
    }

    public function update(Task $task, array $data, ?int $projectId = null): Task
    {
        $oldCategoryId = $task->category_id;
        $task->update($data);

        Cache::tags(["task:{$task->id}"])->flush();

        if ($projectId !== null) {
            $this->clearProjectCache($projectId);
        } else {
            $this->clearCategoryCache($oldCategoryId);

            if ($task->category_id !== $oldCategoryId) {
                $this->clearCategoryCache($task->category_id);
            }
        }

        return $task;
    }

    public function delete(Task $task): void
    {
        $categoryId = $task->category_id;
        $task->delete();

        Cache::tags(["task:{$task->id}"])->flush();
        $this->clearCategoryCache($categoryId);
    }

    public function getByCategory(Category $category): Collection
    {
        return Task::sorted()->where('category_id', $category->id)->get();
    }

    public function getFirstByCategory(Category $category, int $excludeId): ?Task
    {
        return Task::sorted()
            ->where('category_id', $category->id)
            ->where('id', '!=', $excludeId)
            ->first();
    }

    public function findByCategoryOrFail(Category $category, int $id): Task
    {
        return $category->tasks()->findOrFail($id);
    }

    public function clearCategoryCache(int $categoryId): void
    {
        $projectId = $this->categoryRepository->getProjectId($categoryId);

        if ($projectId) {
            $this->clearProjectCache($projectId);
        }
    }

    public function clearProjectCache(int $projectId): void
    {
        Cache::tags(["project:{$projectId}:categories"])->flush();
    }
}