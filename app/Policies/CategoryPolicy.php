<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    public function show(User $user, Category $category): bool
    {
        return $this->isCategoryOwner($user, $category);
    }

    public function edit(User $user, Category $category): bool
    {
        return $this->isCategoryOwner($user, $category);
    }

    public function update(User $user, Category $category): bool
    {
        return $this->isCategoryOwner($user, $category);
    }

    public function delete(User $user, Category $category): bool
    {
        return $this->isCategoryOwner($user, $category);
    }

    protected function isCategoryOwner(User $user, Category $category): bool
    {
        return $user->projects()
            ->where('projects.id', $category->project_id)
            ->exists();
    }
}
