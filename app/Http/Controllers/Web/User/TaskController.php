<?php

namespace App\Http\Controllers\Web\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Task\DestroyTaskRequest;
use App\Http\Requests\Web\Task\EditTaskRequest;
use App\Http\Requests\Web\Task\StoreTaskRequest;
use App\Http\Requests\Web\Task\UpdateTaskRequest;
use App\Models\Task;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function create()
    {
        return Inertia::render('User/Task/NewTask');
    }

    public function store(StoreTaskRequest $request)
    {
        $task = Task::query()->create($request->validated());

        return redirect()->intended(route(
            'projects.show',
            $task->category()->value('project_id')
        ));
    }

    public function edit(EditTaskRequest $request, Task $task)
    {
        return Inertia::render('User/Task/EditTask', [
            'task' => $task,
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());
        $projectId = $task->category()->value('project_id');

        return redirect()->intended(route('projects.show', $projectId));
    }

    public function destroy(DestroyTaskRequest $request, Task $task)
    {
        $task->delete();

        return response()->noContent();
    }
}
