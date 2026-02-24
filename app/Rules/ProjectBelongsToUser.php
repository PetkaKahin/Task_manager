<?php

namespace App\Rules;

use App\Models\Project;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Проверка: принадлежит ли этот проект юзеру?<br>
 * Так же проверяет, что проект существует
 */
class ProjectBelongsToUser implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null) return;

        $belongs = Project::query()
            ->where('id', $value)
            ->whereHas('users', fn($q) => $q->where('users.id', auth()->id()))
            ->exists();

        if (!$belongs) {
            $fail(trans('messages.project_not_found'));
        }
    }
}
