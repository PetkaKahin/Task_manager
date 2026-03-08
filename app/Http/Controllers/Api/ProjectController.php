<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Project\ReorderProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService
    ) {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function index(Request $request): array
    {
        /** @var User $user */
        $user = $request->user();
        $projects = $user->projects()->get();

        /** @var array<int, array<string, mixed>> */
        return ProjectResource::collection($projects)->resolve();
    }

    public function reorder(ReorderProjectRequest $request, Project $project): ProjectResource
    {
        $this->projectService->reorder($request, $project);

        return new ProjectResource($project);
    }
}
