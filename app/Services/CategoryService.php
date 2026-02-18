<?php

namespace App\Services;

use App\Http\Requests\Api\Category\ReorderCategoryRequest;
use App\Models\Category;
use App\Models\Project;

class CategoryService {

    /**
     * Вставляет Category после ReorderCategoryRequest->move_after
     *
     * @param ReorderCategoryRequest $request
     * @param Project $project
     * @param Category $category
     * @return void
     * @throws \AlexCrawford\Sortable\SortableException
     */

    public function reorder(ReorderCategoryRequest $request, Project $project, Category $category): void
    {
        if ($request->move_after === null) {
            $first = $project->categories()
                ->sorted()
                ->where('id', '!=', $category->id)
                ->first();

            if ($first) {
                $category->moveBefore($first);
            }
        } else {
            $category->moveAfter(
                $project->categories()->findOrFail($request->move_after)
            );
        }
    }
}
