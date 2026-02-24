<?php

namespace App\Services;

use App\Http\Requests\Api\Task\ReorderTaskRequest;
use App\Models\Category;
use App\Models\Project;
use App\Models\Task;

class TaskService {

    /**
     * Вставляет Task после ReorderTaskRequest->move_after_id и возвращает его <br>
     * Сам обращается к БД за нужными данными
     */
    public function reorder(ReorderTaskRequest $request, Project $project, Category $category, Task $task): Task
    {
        // Определяем целевую категорию
        $targetCategory = $request->filled('category_id')
            ? $project->categories()->findOrFail($request->category_id)
            : $category;

        // Если категория меняется — обновляем связь
        if ($targetCategory->id !== $category->id) {
            $task->update(['category_id' => $targetCategory->id]);
        }

        // Перемещаем
        if ($request->move_after_id === null) {
            $first = $targetCategory->tasks()
                ->sorted()
                ->where('id', '!=', $task->id)
                ->first();

            if ($first) {
                $task->moveBefore($first);
            }
        } else {
            $task->moveAfter(
                $targetCategory->tasks()->findOrFail($request->move_after_id)
            );
        }

        return $task;
    }
}
