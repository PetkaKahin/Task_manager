<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Task\ReorderTaskRequest;
use App\Http\Requests\Api\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(string $projectId, string $categoryId)
    {

    }

    public function store(Request $request)
    {

    }

    public function show(string $id)
    {

    }

    public function update(UpdateTaskRequest $request, string $projectId, string $categoryId, string $taskId)
    {
        $task = auth()->user()
            ->projects()->findOrFail($projectId)
            ->categories()->findOrFail($categoryId)
            ->tasks()->findOrFail($taskId);

        $task->update($request->validated());

        return new TaskResource($task);
    }

    public function destroy(string $id)
    {

    }

    public function reorder(ReorderTaskRequest $request, string $projectId, string $categoryId, string $taskId)
    {
        //TODO вынести в сервис

        $project = auth()->user()->projects()->findOrFail($projectId);

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
    }
}
