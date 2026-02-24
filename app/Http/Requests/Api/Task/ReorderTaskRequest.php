<?php

namespace App\Http\Requests\Api\Task;

use App\Rules\CategoryBelongsToUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReorderTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('task'));
    }

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
                new CategoryBelongsToUser,
            ],
        ];
    }
}
