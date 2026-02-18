<?php

namespace App\Services;

use App\Http\Requests\Api\Task\ReorderTaskRequest;
use App\Models\Project;
use App\Models\Task;

class TaskService {

    /**
     * Вставляет Task после ReorderTaskRequest->move_after и возвращает его <br>
     * Сам обращается к БД за нужными данными
     *
     * @param ReorderTaskRequest $request
     * @param Project $project
     * @param int $categoryId
     * @param int $taskId
     * @return Task
     */

    public function reorder(ReorderTaskRequest $request, Project $project, int $categoryId, int $taskId): Task
    {
        // Находим таску в текущей категории
        $currentCategory = $project->categories()->findOrFail($categoryId);
        $task = $currentCategory->tasks()->findOrFail($taskId);

        // Определяем целевую категорию
        $targetCategory = $request->has('category_id')
            ? $project->categories()->findOrFail($request->category_id)
            : $currentCategory;

        // Если категория меняется — обновляем связь
        if ($targetCategory->id !== $currentCategory->id) {
            $task->update(['category_id' => $targetCategory->id]);
        }

        // Перемещаем
        if ($request->move_after === null) {
            $first = $targetCategory->tasks()
                ->sorted()
                ->where('id', '!=', $task->id)
                ->first();

            if ($first) {
                $task->moveBefore($first);
            }
        } else {
            $task->moveAfter(
                $targetCategory->tasks()->findOrFail($request->move_after)
            );
        }

        return $task;
    }
}
