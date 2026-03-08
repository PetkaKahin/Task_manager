<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Category;

use Illuminate\Foundation\Http\FormRequest;

class ShowCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('show', $this->route('category')) ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [];
    }
}
