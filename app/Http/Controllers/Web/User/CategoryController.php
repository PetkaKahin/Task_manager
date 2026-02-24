<?php

namespace App\Http\Controllers\Web\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Category\UpdateCategoryRequest;
use App\Http\Requests\Web\Category\DestroyCategoryRequest;
use App\Http\Requests\Web\Category\EditCategoryRequest;
use App\Http\Requests\Web\Category\StoreCategoryRequest;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function create()
    {
        return Inertia::render('User/Category/NewCategory');
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return redirect()->intended(route('projects.show', $category->project_id));
    }

    public function edit(EditCategoryRequest $request, Category $category)
    {
        return Inertia::render('User/Category/EditCategory', [
            'category' => $category,
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()->intended(route('projects.show', $category->project_id));
    }

    public function destroy(DestroyCategoryRequest $request, Category $category)
    {
        $category->delete();

        return response()->noContent();
    }
}
