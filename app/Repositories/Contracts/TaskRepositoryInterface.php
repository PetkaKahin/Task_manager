<?php

namespace App\Repositories\Contracts;

use App\Models\Category;
use App\Models\Task;
use Illuminate\Support\Collection;

interface TaskRepositoryInterface
{
    public function find(int $id): ?Task;
    public function create(array $data): Task;
    public function update(Task $task, array $data, ?int $projectId = null): Task;
    public function delete(Task $task): void;
    public function getByCategory(Category $category): Collection;
    public function getFirstByCategory(Category $category, int $excludeId): ?Task;
    public function findByCategoryOrFail(Category $category, int $id): Task;
    public function clearCategoryCache(int $categoryId): void;
    public function clearProjectCache(int $projectId): void;
}