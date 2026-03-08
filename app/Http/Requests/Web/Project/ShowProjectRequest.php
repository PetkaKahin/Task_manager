<?php

declare(strict_types=1);

namespace App\Http\Requests\Web\Project;

use Illuminate\Foundation\Http\FormRequest;

class ShowProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('show', $this->route('project')) ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [];
    }
}
