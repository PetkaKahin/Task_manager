<?php

namespace App\Repositories\Contracts;

use App\Models\Project;
use App\Models\User;

interface ProjectRepositoryInterface
{
    public function getByUser(User $user): mixed;
    public function find(int $id): Project | null;
    public function create(array $data): Project;
    public function update(Project $project, array $data): Project;
    public function delete(Project $project): void;
    public function getFirstByUser(User $user, int $excludeId): ?Project;
    public function findByUserOrFail(User $user, int $id): Project;
}
