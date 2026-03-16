<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use App\Repositories\CategoryRepository;
use App\Repositories\ProjectRepository;

class TaskPolicy
{
    public function __construct(
        private readonly ProjectRepository $projectRepository,
        private readonly CategoryRepository $categoryRepository,
    ) {}

    public function edit(User $user, Task $task): bool
    {
        return $this->isTaskOwner($user, $task);
    }

    public function update(User $user, Task $task): bool
    {
        return $this->isTaskOwner($user, $task);
    }

    public function delete(User $user, Task $task): bool
    {
        return $this->isTaskOwner($user, $task);
    }

    protected function isTaskOwner(User $user, Task $task): bool
    {
        $projectId = $this->categoryRepository->getProjectId($task->category_id);

        if (!$projectId) {
            return false;
        }

        return $this->projectRepository
            ->getByUser($user)
            ->contains('id', $projectId);
    }
}