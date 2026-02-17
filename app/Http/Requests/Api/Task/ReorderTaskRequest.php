<?php

namespace App\Http\Requests\Api\Task;

use Illuminate\Foundation\Http\FormRequest;

class ReorderTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'move_after_id' => [
                'nullable',
                'integer',
            ],
            'category_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
            ],
        ];
    }
}
