<?php

namespace App\Repositories\Contracts;

use App\Models\Category;
use App\Models\Project;
use Illuminate\Support\Collection;

interface CategoryRepositoryInterface
{
    public function getByProject(Project $project): Collection;
    public function findByProjectOrFail(Project $project, int $id): Category;
    public function getFirstByProject(Project $project, int $excludeId): ?Category;
    public function create(array $data): Category;
    public function update(Category $category, array $data): Category;
    public function delete(Category $category): void;
    public function getProjectId(int $categoryId): ?int;
}