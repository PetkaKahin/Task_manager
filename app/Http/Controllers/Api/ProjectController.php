<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Project\ReorderProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\ProjectService;

class ProjectController extends Controller
{
    public function __construct(private ProjectService $projectService)
    {
    }

    public function index()
    {
        $user = auth()->user();
        $projects = $user->projects()->sorted()->get();

        return ProjectResource::collection($projects)->resolve();
    }

    public function reorder(ReorderProjectRequest $request, Project $project)
    {
        $this->projectService->reorder($request, $project);

        return new ProjectResource($project);
    }
}
