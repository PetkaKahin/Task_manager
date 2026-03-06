<?php

namespace App\Http\Controllers\Web\User;

use App\Events\Project\CreatedProject;
use App\Events\Project\DeletedProject;
use App\Events\Project\UpdatedProject;
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

        $userProjects = $user->projects();
        $newProjectWithPivot = $userProjects->findOrFail($newProject->id);
        $first = $userProjects
            ->where('projects.id', '!=', $newProject->id)
            ->first();

        if ($first) {
            $userProjects->moveBefore($newProjectWithPivot, $first);
        }

        broadcast(new CreatedProject($user->id, $newProject->id, $newProject->title))->toOthers();

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

        $userId = auth()->id();
        broadcast(new UpdatedProject($userId, $project->id, $project->title))->toOthers();

        return redirect()->intended(route('projects.show', $project->id));
    }

    public function destroy(DestroyProjectRequest $request, Project $project)
    {
        $userId = auth()->id();
        $projectId = $project->id;

        $project->delete();

        broadcast(new DeletedProject($userId, $projectId))->toOthers();

        return response()->noContent();
    }
}
