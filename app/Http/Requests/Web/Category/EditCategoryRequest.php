<?php

namespace App\Http\Requests\Web\Category;

use Illuminate\Foundation\Http\FormRequest;

class EditCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('edit', $this->route('category'));
    }

    public function rules(): array
    {
        return [];
    }
}
