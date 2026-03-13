<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Events\Category\ReorderedCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Category\DestroyCategoryRequest;
use App\Http\Requests\Api\Category\ReorderCategoryRequest;
use App\Http\Requests\Api\Category\ShowCategoryRequest;
use App\Http\Requests\Api\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService
    ) {
    }

    public function show(ShowCategoryRequest $request, Category $category): CategoryResource
    {
        return new CategoryResource($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        $category->update($request->validated());

        return new CategoryResource($category);
    }

    public function destroy(DestroyCategoryRequest $request, Category $category): Response
    {
        $category->delete();

        return response()->noContent();
    }

    // TODO добавить переодическую оптимизацию позиции
    public function reorder(ReorderCategoryRequest $request, Category $category): CategoryResource
    {
        $category->loadMissing('project');
        $project = $category->project;
        $this->categoryService->reorder($request, $project, $category);

        broadcast(new ReorderedCategory($project))->toOthers();

        return new CategoryResource($category);
    }
}
