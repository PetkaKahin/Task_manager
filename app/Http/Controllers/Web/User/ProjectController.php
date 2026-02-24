<?php

namespace App\Http\Controllers\Web\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Project\DestroyProjectRequest;
use App\Http\Requests\Web\Project\EditProjectRequest;
use App\Http\Requests\Web\Project\ShowProjectRequest;
use App\Http\Requests\Web\Project\StoreProjectRequest;
use App\Http\Requests\Web\Project\UpdateProjectRequest;
use App\Models\Project;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function create()
    {
        return Inertia::render('User/Project/NewProject');
    }

    public function store(StoreProjectRequest $request)
    {
        $user = auth()->user();
        $newProject = Project::factory()->default($user, $request->title)->create();

        return redirect()->intended(route('projects.show', $newProject->id));
    }

    public function show(ShowProjectRequest $request, Project $project)
    {
        // TODO сделать билдер для моделей использующих lexorank
        $categories = $project->categories()->sorted()
            ->with(['tasks' => fn ($query) => $query->sorted()])
            ->get();

        return Inertia::render('User/Dashboard', [
            'project'    => $project,
            'categories' => $categories,
        ]);
    }

    public function edit(EditProjectRequest $request, Project $project)
    {
        return Inertia::render('User/Project/EditProject', [
            'project' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        return redirect()->intended(route('projects.show', $project->id));
    }

    public function destroy(DestroyProjectRequest $request, Project $project)
    {
        $project->delete();

        return response()->noContent();
    }
}
