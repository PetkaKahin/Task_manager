<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Task\ReorderTaskRequest;
use App\Http\Requests\Api\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Services\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ){}

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
        $project = auth()->user()->projects()->findOrFail($projectId);
        $task = $this->taskService->reorder($request, $project, $categoryId, $taskId);

        return new TaskResource($task);
    }
}
