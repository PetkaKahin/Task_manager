<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Repositories\ProjectRepository;

class ProjectPolicy
{
    public function __construct(
        private readonly ProjectRepository $projectRepository,
    ) {}

    public function show(User $user, Project $project): bool
    {
        return $this->isProjectOwner($user, $project);
    }

    public function edit(User $user, Project $project): bool
    {
        return $this->isProjectOwner($user, $project);
    }

    public function update(User $user, Project $project): bool
    {
        return $this->isProjectOwner($user, $project);
    }

    public function delete(User $user, Project $project): bool
    {
        return $this->isProjectOwner($user, $project);
    }

    protected function isProjectOwner(User $user, Project $project): bool
    {
        return $this->projectRepository
            ->getByUser($user)
            ->contains('id', $project->id);
    }
}
