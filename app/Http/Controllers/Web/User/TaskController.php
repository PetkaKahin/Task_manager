<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Task\DestroyTaskRequest;
use App\Http\Requests\Web\Task\EditTaskRequest;
use App\Http\Requests\Web\Task\StoreTaskRequest;
use App\Http\Requests\Web\Task\UpdateTaskRequest;
use App\Models\Task;
use App\Repositories\TaskRepository;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function __construct(
        private readonly TaskRepository $taskRepository,
    ) {}

    public function create(): Response
    {
        return Inertia::render('User/Task/NewTask');
    }

    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $task = $this->taskRepository->create($request->validated());

        return redirect()->intended(route(
            'projects.show',
            $task->category()->value('project_id')
        ));
    }

    public function edit(EditTaskRequest $request, Task $task): Response
    {
        return Inertia::render('User/Task/EditTask', [
            'task' => $task,
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $this->taskRepository->update($task, $request->validated());
        $projectId = $task->category()->value('project_id');

        return redirect()->intended(route('projects.show', $projectId));
    }

    public function destroy(DestroyTaskRequest $request, Task $task): \Illuminate\Http\Response
    {
        $this->taskRepository->delete($task);

        return response()->noContent();
    }
}