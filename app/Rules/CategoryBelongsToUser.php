<?php

namespace App\Rules;

use App\Models\Category;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Проверка: принадлежит ли эта категория юзеру?<br>
 * Так же проверяет, что категория существует
 */
class CategoryBelongsToUser implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null) return;

        $belongs = Category::query()
            ->where('id', $value)
            ->whereHas('project.users', fn($q) => $q->where('users.id', auth()->id()))
            ->exists();

        if (!$belongs) {
            $fail(trans('messages.category_not_found'));
        }
    }
}
