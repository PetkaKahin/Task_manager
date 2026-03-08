<?php

declare(strict_types=1);

namespace App\Services;

use App\Http\Requests\Api\Category\ReorderCategoryRequest;
use App\Models\Category;
use App\Models\Project;

class CategoryService
{
    /**
     * Вставляет Category после ReorderCategoryRequest->move_after_id
     */
    public function reorder(ReorderCategoryRequest $request, Project $project, Category $category): void
    {
        if ($request->move_after_id === null) {
            $first = Category::sorted()
                ->where('project_id', $project->id)
                ->where('id', '!=', $category->id)
                ->first();

            if ($first) {
                $category->moveBefore($first);
            }
        } else {
            $category->moveAfter(
                $project->categories()->findOrFail((int) $request->move_after_id)
            );
        }
    }
}
