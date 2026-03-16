<?php

declare(strict_types=1);

namespace App\Rules;

use App\Models\User;
use App\Repositories\CategoryRepository;
use App\Repositories\ProjectRepository;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CategoryBelongsToUser implements ValidationRule
{
    public function __construct(
        private readonly ProjectRepository $projectRepository,
        private readonly CategoryRepository $categoryRepository,
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null) {
            return;
        }

        $projectId = $this->categoryRepository->getProjectId((int) $value);

        if (!$projectId) {
            $fail(trans('messages.category_not_found'));
            return;
        }

        /** @var User $user */
        $user = auth()->user();

        if (!$this->projectRepository->getByUser($user)->contains('id', $projectId)) {
            $fail(trans('messages.category_not_found'));
        }
    }
}