<?php

declare(strict_types=1);

namespace App\Http\Requests\Web\Category;

use App\Rules\ProjectBelongsToUser;
use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'project_id' => [
                'required',
                new ProjectBelongsToUser(),
            ],
        ];
    }
}
