<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Task\ReorderTaskRequest;
use App\Http\Requests\Api\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ){}

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

        return new TaskResource($newTask);
    }
}
