<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Category\DestroyCategoryRequest;
use App\Http\Requests\Api\Category\ReorderCategoryRequest;
use App\Http\Requests\Api\Category\ShowCategoryRequest;
use App\Http\Requests\Api\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $categoryService)
    {
    }

    public function show(ShowCategoryRequest $request, Category $category)
    {
        return new CategoryResource($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return new CategoryResource($category);
    }

    public function destroy(DestroyCategoryRequest $request, Category $category)
    {
        $category->delete();

        return response()->noContent();
    }

    // TODO добавить переодическую оптимизацию позиции
    public function reorder(ReorderCategoryRequest $request, Category $category)
    {
        $category->loadMissing('project');
        $project = $category->project;
        $this->categoryService->reorder($request, $project, $category);

        return new CategoryResource($category);
    }
}
