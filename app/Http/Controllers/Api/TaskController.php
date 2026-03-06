<?php

namespace App\Http\Controllers\Api;

use App\Events\Task\ReorderedTask;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Task\ReorderTaskRequest;
use App\Http\Requests\Api\Task\StoreTaskRequest;
use App\Http\Requests\Api\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ){}

    public function store(StoreTaskRequest $request)
    {
        $task = Task::query()->create($request->validated());

        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());

        return new TaskResource($task);
    }

    public function reorder(ReorderTaskRequest $request, Task $task)
    {
        $task->loadMissing(['category.project']);
        $category = $task->category;
        $project = $category->project;

        $newTask = $this->taskService->reorder($request, $project, $category, $task);

        $targetCategory = $newTask->category;
        $sortedIds = $targetCategory->tasks()->sorted()->pluck('id')->all();

        broadcast(new ReorderedTask(
            $project->id,
            $targetCategory->id,
            $sortedIds,
        ))->toOthers();

        // Если таска переехала в другую категорию — обновляем и старую
        if ($targetCategory->id !== $category->id) {
            $oldSortedIds = $category->tasks()->sorted()->pluck('id')->all();
            broadcast(new ReorderedTask(
                $project->id,
                $category->id,
                $oldSortedIds,
            ))->toOthers();
        }

        return new TaskResource($newTask);
    }
}
