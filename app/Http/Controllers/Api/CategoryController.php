<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Category\ReorderCategoryRequest;
use App\Http\Requests\Api\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {

    }

    public function store(Request $request)
    {

    }

    public function show(string $projectId, string $categoryId)
    {
        $category = auth()->user()
            ->projects()->findOrFail($projectId)
            ->categories()->with('tasks')->findOrFail($categoryId);

        return new CategoryResource($category);
    }

    public function update(UpdateCategoryRequest $request, string $projectId, string $categoryId)
    {
        $category = auth()->user()
            ->projects()->findOrFail($projectId)
            ->categories()->findOrFail($categoryId);

        $category->update($request->validated());

        return new CategoryResource($category);
    }

    public function destroy(string $id)
    {
        $category = auth()->user()->categories()->findOrFail($id);
        $category->delete();

        return response()->noContent();
    }

    // TODO добавить переодическую оптимизацию позиции
    public function reorder(ReorderCategoryRequest $request, string $projectId, string $categoryId)
    {
        //TODO вынести в сервис

        $project = auth()->user()
            ->projects()->findOrFail($projectId);

        $category = $project->categories()->findOrFail($categoryId);

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

        return new CategoryResource($category);
    }
}
