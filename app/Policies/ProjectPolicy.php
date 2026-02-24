<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
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
        return $user->projects()
            ->where('projects.id', $project->id)
            ->exists();
    }
}
