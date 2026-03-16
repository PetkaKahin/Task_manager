<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\Task\ReorderedTask;
use App\Http\Requests\Api\Task\ReorderTaskRequest;
use App\Models\Category;
use App\Models\Project;
use App\Models\Task;
use App\Repositories\CategoryRepository;
use App\Repositories\TaskRepository;

class TaskService
{
    public function __construct(
        private readonly TaskRepository $taskRepository,
        private readonly CategoryRepository $categoryRepository,
    ) {}

    /**
     * Вставляет Task после ReorderTaskRequest->move_after_id и возвращает его <br>
     * Сам обращается к БД за нужными данными
     */
    public function reorder(ReorderTaskRequest $request, Project $project, Category $category, Task $task): Task
    {
        $oldCategoryId = $category->id;
        $targetCategory = $this->moveTask($request, $project, $category, $task);

        // update() already cleared cache when category changed
        if ($targetCategory->id === $oldCategoryId) {
            $this->taskRepository->clearProjectCache($project->id);
        }

        $this->broadcastReorder($project, $category, $targetCategory);

        return $task;
    }

    private function moveTask(ReorderTaskRequest $request, Project $project, Category $category, Task $task): Category
    {
        // Определяем целевую категорию
        $targetCategory = $request->filled('category_id')
            ? $this->categoryRepository->findByProjectOrFail($project, (int) $request->category_id)
            : $category;

        // Если категория меняется — обновляем связь
        if ($targetCategory->id !== $category->id) {
            $this->taskRepository->update($task, ['category_id' => $targetCategory->id], $project->id);
        }

        // Перемещаем
        if ($request->move_after_id === null) {
            $first = $this->taskRepository->getFirstByCategory($targetCategory, $task->id);

            if ($first) {
                $task->moveBefore($first);
            }
        } else {
            $task->moveAfter(
                $this->taskRepository->findByCategoryOrFail($targetCategory, (int) $request->move_after_id)
            );
        }

        return $targetCategory;
    }

    private function broadcastReorder(Project $project, Category $oldCategory, Category $targetCategory): void
    {
        // TODO 2 бродкаста как-то не оптимизированно, подумать как сделать нормально

        broadcast(new ReorderedTask(
            category: $targetCategory
        ))->toOthers();

        // Если таска переехала в другую категорию — обновляем и старую
        if ($targetCategory->id !== $oldCategory->id) {
            broadcast(new ReorderedTask(
                $oldCategory,
            ))->toOthers();
        }
    }
}