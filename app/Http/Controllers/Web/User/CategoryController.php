<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Category\DestroyCategoryRequest;
use App\Http\Requests\Web\Category\EditCategoryRequest;
use App\Http\Requests\Web\Category\StoreCategoryRequest;
use App\Http\Requests\Web\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('User/Category/NewCategory');
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $category = Category::create($request->validated());

        return redirect()->intended(route('projects.show', $category->project_id));
    }

    public function edit(EditCategoryRequest $request, Category $category): Response
    {
        return Inertia::render('User/Category/EditCategory', [
            'category' => $category,
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());

        return redirect()->intended(route('projects.show', $category->project_id));
    }

    public function destroy(DestroyCategoryRequest $request, Category $category): \Illuminate\Http\Response
    {
        $category->delete();

        return response()->noContent();
    }
}
