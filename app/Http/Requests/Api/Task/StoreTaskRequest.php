<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Task;

use App\Rules\CategoryBelongsToUser;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'category_id' => [
                'required',
                new CategoryBelongsToUser(),
            ],
            'content' => [
                'nullable',
                'array',
            ],
        ];
    }
}
