<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\Task\ReorderedTask;
use App\Http\Requests\Api\Task\ReorderTaskRequest;
use App\Models\Category;
use App\Models\Project;
use App\Models\Task;

class TaskService
{
    /**
     * Вставляет Task после ReorderTaskRequest->move_after_id и возвращает его <br>
     * Сам обращается к БД за нужными данными
     */
    public function reorder(ReorderTaskRequest $request, Project $project, Category $category, Task $task): Task
    {
        $targetCategory = $this->moveTask($request, $project, $category, $task);

        $this->broadcastReorder($project, $category, $targetCategory);

        return $task;
    }

    private function moveTask(ReorderTaskRequest $request, Project $project, Category $category, Task $task): Category
    {
        // Определяем целевую категорию
        $targetCategory = $request->filled('category_id')
            ? $project->categories()->findOrFail((int) $request->category_id)
            : $category;

        // Если категория меняется — обновляем связь
        if ($targetCategory->id !== $category->id) {
            $task->update(['category_id' => $targetCategory->id]);
        }

        // Перемещаем
        if ($request->move_after_id === null) {
            $first = Task::sorted()
                ->where('category_id', $targetCategory->id)
                ->where('id', '!=', $task->id)
                ->first();

            if ($first) {
                $task->moveBefore($first);
            }
        } else {
            $task->moveAfter(
                $targetCategory->tasks()->findOrFail((int) $request->move_after_id)
            );
        }

        return $targetCategory;
    }

    private function broadcastReorder(Project $project, Category $oldCategory, Category $targetCategory): void
    {
        /** @var array<int> $sortedIds */
        $sortedIds = Task::sorted()->where('category_id', $targetCategory->id)->pluck('id')->all();

        broadcast(new ReorderedTask(
            $project->id,
            $targetCategory->id,
            $sortedIds,
        ))->toOthers();

        // Если таска переехала в другую категорию — обновляем и старую
        if ($targetCategory->id !== $oldCategory->id) {
            /** @var array<int> $oldSortedIds */
            $oldSortedIds = Task::sorted()->where('category_id', $oldCategory->id)->pluck('id')->all();
            broadcast(new ReorderedTask(
                $project->id,
                $oldCategory->id,
                $oldSortedIds,
            ))->toOthers();
        }
    }
}
