<?php

namespace App\Http\Requests\Api\Task;

use App\Rules\CategoryBelongsToUser;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('task'));
    }

    public function rules(): array
    {
        return [
            'title' => [
                'nullable',
                'string',
                'max:255',
                'min:1',
            ],
            'content' => [
                'nullable',
                'string',
                'max:65535',
            ],
            'category_id' => [
                'nullable',
                'integer',
                new CategoryBelongsToUser(),
            ],
        ];
    }
}
