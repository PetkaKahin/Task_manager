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
        $userProjects = $request->user()->projects();

        if ($request->move_after_id === null) {
            $first = $userProjects
                ->sorted()
                ->where('projects.id', '!=', $project->id)
                ->first();

            if ($first) {
                $project->moveBefore($first);
            }
        } else {
            $project->moveAfter(
                $userProjects->findOrFail($request->move_after_id)
            );
        }
    }
}
