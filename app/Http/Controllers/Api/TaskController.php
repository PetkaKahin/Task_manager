<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Task\ReorderTaskRequest;
use App\Http\Requests\Api\Task\StoreTaskRequest;
use App\Http\Requests\Api\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Repositories\ProjectRepository;
use App\Repositories\TaskRepository;
use App\Services\TaskService;

class TaskController extends Controller
{
    public function __construct(
        private readonly TaskService $taskService,
        private readonly TaskRepository $taskRepository,
        private readonly ProjectRepository $projectRepository,
    ) {
    }

    public function store(StoreTaskRequest $request): TaskResource
    {
        $task = $this->taskRepository->create($request->validated());

        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $this->taskRepository->update($task, $request->validated());

        return new TaskResource($task);
    }

    public function reorder(ReorderTaskRequest $request, Task $task): TaskResource
    {
        $task->loadMissing('category');
        $project = $this->projectRepository->find($task->category->project_id) ?? abort(404);

        $task = $this->taskService->reorder($request, $project, $task->category, $task);

        return new TaskResource($task);
    }
}