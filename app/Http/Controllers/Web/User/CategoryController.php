<?php

namespace App\Http\Controllers\Web\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Category\UpdateCategoryRequest;
use App\Http\Requests\Web\Category\StoreCategoryRequest;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {

    }

    public function create()
    {
        return Inertia::render('User/Category/NewCategory');
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::query()->create($request->validated());

        return redirect()->intended(route('dashboard.index', $category->project_id));
    }

    public function show(string $id)
    {

    }

    public function edit(string $id)
    {
        $category = Category::query()->findOrFail($id);

        return Inertia::render('User/Category/EditCategory', [
            'category' => $category,
        ]);
    }

    public function update(UpdateCategoryRequest $request, string $id)
    {
        $category = Category::query()->findOrFail($id);
        $category->update($request->validated());

        return redirect()->intended(route('dashboard.index', $category->project_id));
    }

    public function destroy(string $id)
    {
        Category::query()->findOrFail($id)->delete();

        return response()->noContent();
    }
}
