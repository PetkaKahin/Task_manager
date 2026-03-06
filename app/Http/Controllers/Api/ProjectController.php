<?php

namespace App\Http\Controllers\Api;

use App\Events\Project\ReorderedProject;
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
        $projects = $user->projects()->get();

        return ProjectResource::collection($projects)->resolve();
    }

    public function reorder(ReorderProjectRequest $request, Project $project)
    {
        $this->projectService->reorder($request, $project);

        $user = auth()->user();
        $sortedIds = $user->projects()->pluck('projects.id')->all();
        broadcast(new ReorderedProject($user->id, $sortedIds))->toOthers();

        return new ProjectResource($project);
    }
}
