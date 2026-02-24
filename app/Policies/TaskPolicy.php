<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function edit(User $user, Task $task): bool
    {
        return $this->isCategoryOwner($user, $task->category()->value('project_id'));
    }

    public function update(User $user, Task $task): bool
    {
        return $this->isCategoryOwner($user, $task->category()->value('project_id'));
    }

    public function delete(User $user, Task $task): bool
    {
        return $this->isCategoryOwner($user, $task->category()->value('project_id'));
    }

    protected function isCategoryOwner(User $user, int $projectId): bool
    {
        return $user->projects()
            ->where('projects.id', $projectId)
            ->exists();
    }
}
