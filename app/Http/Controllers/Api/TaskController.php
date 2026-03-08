<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

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
        private readonly TaskService $taskService
    ) {
    }

    public function store(StoreTaskRequest $request): TaskResource
    {
        $task = Task::query()->create($request->validated());

        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $task->update($request->validated());

        return new TaskResource($task);
    }

    public function reorder(ReorderTaskRequest $request, Task $task): TaskResource
    {
        $task->loadMissing(['category.project']);

        $task = $this->taskService->reorder($request, $task->category->project, $task->category, $task);

        return new TaskResource($task);
    }
}
