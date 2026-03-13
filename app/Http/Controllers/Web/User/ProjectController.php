<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\User;

use App\Events\Project\DeletedProject;
use App\Events\Project\UpdatedProject;
use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Project\DestroyProjectRequest;
use App\Http\Requests\Web\Project\EditProjectRequest;
use App\Http\Requests\Web\Project\ShowProjectRequest;
use App\Http\Requests\Web\Project\StoreProjectRequest;
use App\Http\Requests\Web\Project\UpdateProjectRequest;
use App\Builders\SortableBuilder;
use App\Models\Category;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService
    ) {
    }
    public function create(): Response
    {
        return Inertia::render('User/Project/NewProject');
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = auth()->user();
        $newProject = $this->projectService->create($user, $request->string('title')->toString());

        return redirect()->intended(route('projects.show', $newProject->id));
    }

    public function show(ShowProjectRequest $request, Project $project): Response
    {
        $categories = Category::sorted()
            ->where('project_id', $project->id)
            ->with(['tasks' => function (mixed $query): void {
                /** @var SortableBuilder<Task> $query */
                $query->sorted();
            }])
            ->get();

        return Inertia::render('User/Dashboard', [
            'project' => $project,
            'categories' => $categories,
        ]);
    }

    public function edit(EditProjectRequest $request, Project $project): Response
    {
        return Inertia::render('User/Project/EditProject', [
            'project' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $project->update($request->validated());

        broadcast(new UpdatedProject($project))->toOthers();

        return redirect()->intended(route('projects.show', $project->id));
    }

    public function destroy(DestroyProjectRequest $request, Project $project): \Illuminate\Http\Response
    {
        $project->delete();

        broadcast(new DeletedProject($project))->toOthers();

        return response()->noContent();
    }
}
