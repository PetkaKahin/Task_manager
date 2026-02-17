<?php

namespace App\Http\Requests\Api\Task;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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
                'json',
            ],
            'category_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
            ],
        ];
    }
}
