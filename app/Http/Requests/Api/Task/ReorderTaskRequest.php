<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Task;

use App\Rules\CategoryBelongsToUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property int|null $move_after_id
 * @property int|null $category_id
 */
class ReorderTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('task')) ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'move_after_id' => [
                'nullable',
                'integer',
                Rule::exists('tasks', 'id')->whereNull('deleted_at'),
            ],
            'category_id' => [
                'nullable',
                'integer',
                new CategoryBelongsToUser(),
            ],
        ];
    }
}
