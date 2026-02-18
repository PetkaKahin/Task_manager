<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Category\ReorderCategoryRequest;
use App\Http\Requests\Api\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $categoryService)
    {
    }

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
        $project = auth()->user()->projects()->findOrFail($projectId);
        $category = $project->categories()->findOrFail($categoryId);

        $this->categoryService->reorder($request, $project, $category);

        return new CategoryResource($category);
    }
}
