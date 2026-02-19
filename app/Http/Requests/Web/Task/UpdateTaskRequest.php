<?php

namespace App\Http\Requests\Web\Task;

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
                'string',
                'max:255',
            ],
            'category_id' => [
                'exists:categories,id',
            ],
            'content' => [
                'string',
                'nullable',
                'max:65535',
            ],
        ];
    }
}
