<?php

declare(strict_types=1);

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
            category: $category,
        ))->toOthers();
    }

    public function updated(Category $category): void
    {
        broadcast(new UpdatedCategory(
            category: $category,
        ))->toOthers();
    }

    public function deleted(Category $category): void
    {
        broadcast(new DeletedCategory(
            category: $category,
        ))->toOthers();
    }
}
