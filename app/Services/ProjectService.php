<?php

namespace App\Services;

use App\Http\Requests\Api\Project\ReorderProjectRequest;
use App\Models\Project;

class ProjectService {

    /**
     * Вставляет Project после ReorderProjectRequest->move_after_id
     */
    public function reorder(ReorderProjectRequest $request, Project $project): void
    {
        $user = $request->user();
        $projectWithPivot = $user->projects()->findOrFail($project->id);

        if ($request->move_after_id === null) {
            $first = $user->projects()
                ->where('projects.id', '!=', $project->id)
                ->first();

            if ($first) {
                $user->projects()->moveBefore($projectWithPivot, $first);
            }
        } else {
            $afterProject = $user->projects()->findOrFail($request->move_after_id);
            $user->projects()->moveAfter($projectWithPivot, $afterProject);
        }
    }
}
