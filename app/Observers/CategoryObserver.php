<?php

namespace App\Observers;

use App\Events\Category\CreatedCategory;
use App\Events\Category\DeletedCategory;
use App\Events\Category\UpdatedCategory;
use App\Models\Category;

class CategoryObserver
{
    public function created(Category $category): void
    {
        broadcast(new CreatedCategory(
            $category->id,
            $category->title,
            $category->description ?? '',
            $category->project_id,
        ))->toOthers();
    }

    public function updated(Category $category): void
    {
        broadcast(new UpdatedCategory(
            $category->id,
            $category->title,
            $category->description ?? '',
            $category->project_id,
        ))->toOthers();
    }

    public function deleted(Category $category): void
    {
        broadcast(new DeletedCategory(
            $category->id,
            $category->project_id,
        ))->toOthers();
    }
}