<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\Project\CreatedProject;
use App\Events\Project\ReorderedProject;
use App\Http\Requests\Api\Project\ReorderProjectRequest;
use App\Models\Project;
use App\Models\User;
use App\Repositories\ProjectRepository;

class ProjectService
{
    public function __construct(
        private readonly ProjectRepository $projectRepository
    ) {}

    public function create(User $user, string $title): Project
    {
        $newProject = $this->projectRepository->createWithFactory($user, $title);

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
        $projectWithPivot = $this->projectRepository->findByUserOrFail($user, $project->id);

        if ($request->move_after_id === null) {
            $first = $this->projectRepository->getFirstByUser($user, $project->id);

            if ($first) {
                $user->projects()->moveBefore($projectWithPivot, $first);
            }
        } else {
            $afterProject = $this->projectRepository->findByUserOrFail($user, (int) $request->move_after_id);
            $user->projects()->moveAfter($projectWithPivot, $afterProject);
        }

        $this->projectRepository->clearUserCache($user);

        broadcast(new ReorderedProject())->toOthers();
    }
}
