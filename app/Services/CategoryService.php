<?php

namespace App\Services;

use App\Http\Requests\Api\Category\ReorderCategoryRequest;
use App\Models\Category;
use App\Models\Project;

class CategoryService {

    /**
     * Вставляет Category после ReorderCategoryRequest->move_after_id
     */
    public function reorder(ReorderCategoryRequest $request, Project $project, Category $category): void
    {
        if ($request->move_after_id === null) {
            $first = $project->categories()
                ->sorted()
                ->where('id', '!=', $category->id)
                ->first();

            if ($first) {
                $category->moveBefore($first);
            }
        } else {
            $category->moveAfter(
                $project->categories()->findOrFail($request->move_after_id)
            );
        }
    }
}
