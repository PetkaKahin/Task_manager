<?php

namespace App\Http\Requests\Web\Task;

use App\Rules\CategoryBelongsToUser;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        // TODO подумать, нужны ли ограничения?
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'category_id' => [
                'required',
                new CategoryBelongsToUser,
            ],
            'content' => [
                'string',
                'nullable',
                'max:65535',
            ],
        ];
    }
}
