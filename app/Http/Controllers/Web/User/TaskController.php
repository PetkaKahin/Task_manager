<?php

namespace App\Http\Controllers\Web\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Task\StoreTaskRequest;
use App\Http\Requests\Web\Task\UpdateTaskRequest;
use App\Models\Category;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {

    }

    public function create()
    {
        $user = auth()->user();
        $projects = $user->projects()->get();

        return Inertia::render('User/newTask', [
            'projects' => $projects,
        ]);
    }

    public function store(StoreTaskRequest $request)
    {
        Task::query()->create($request->validated());
        $category = Category::query()->findOrFail($request->category_id);
        $project = $category->project()->findOrFail($category->project_id);

        return redirect()->route('dashboard.index',$project->id);
    }

    public function show(string $id)
    {

    }

    public function edit(string $id)
    {
        $user = auth()->user();
        $projects = $user->projects()->get();
        $task = Task::query()->findOrFail($id);

        return Inertia::render('User/editTask', [
            'projects' => $projects,
            'task' => $task,
        ]);
    }

    public function update(UpdateTaskRequest $request, string $id)
    {
        $task = Task::query()->findOrFail($id);
        $task->update($request->validated());
        $category = Category::query()->findOrFail($task->category_id);
        $project = $category->project()->findOrFail($category->project_id);

        return redirect()->route('dashboard.index',$project->id);
    }

    public function destroy(string $id)
    {
        Task::query()->findOrFail($id)->delete();

        return response()->noContent();
    }
}
