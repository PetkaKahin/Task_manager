<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\Project\CreatedProject;
use App\Events\Project\ReorderedProject;
use App\Http\Requests\Api\Project\ReorderProjectRequest;
use App\Models\Project;
use App\Models\User;

class ProjectService
{
    public function create(User $user, string $title): Project
    {
        /** @var Project $newProject */
        $newProject = Project::factory()->default($user, $title)->create();

        /** @var Project $newProjectWithPivot */
        $newProjectWithPivot = $user->projects()->findOrFail($newProject->id);
        $first = $user->projects()
            ->where('projects.id', '!=', $newProject->id)
            ->first();

        if ($first) {
            $user->projects()->moveBefore($newProjectWithPivot, $first);
        }

        broadcast(new CreatedProject($newProject))->toOthers();

        return $newProject;
    }

    /**
     * Вставляет Project после ReorderProjectRequest->move_after_id
     */
    public function reorder(ReorderProjectRequest $request, Project $project): void
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Project $projectWithPivot */
        $projectWithPivot = $user->projects()->findOrFail($project->id);

        if ($request->move_after_id === null) {
            $first = $user->projects()
                ->where('projects.id', '!=', $project->id)
                ->first();

            if ($first) {
                $user->projects()->moveBefore($projectWithPivot, $first);
            }
        } else {
            /** @var Project $afterProject */
            $afterProject = $user->projects()->findOrFail((int) $request->move_after_id);
            $user->projects()->moveAfter($projectWithPivot, $afterProject);
        }

        broadcast(new ReorderedProject())->toOthers();
    }
}
