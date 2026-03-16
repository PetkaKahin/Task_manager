<?php

declare(strict_types=1);

namespace App\Services;

use App\Http\Requests\Api\Category\ReorderCategoryRequest;
use App\Models\Category;
use App\Models\Project;
use App\Repositories\CategoryRepository;

class CategoryService
{
    public function __construct(
        private readonly CategoryRepository $categoryRepository
    ) {}

    /**
     * Вставляет Category после ReorderCategoryRequest->move_after_id
     */
    public function reorder(ReorderCategoryRequest $request, Project $project, Category $category): void
    {
        if ($request->move_after_id === null) {
            $first = $this->categoryRepository->getFirstByProject($project, $category->id);

            if ($first) {
                $category->moveBefore($first);
            }
        } else {
            $category->moveAfter(
                $this->categoryRepository->findByProjectOrFail($project, (int) $request->move_after_id)
            );
        }

        $this->categoryRepository->clearProjectCache($category);
    }
}
