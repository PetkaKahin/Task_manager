<?php

declare(strict_types=1);

namespace App\Http\Requests\Web\Task;

use Illuminate\Foundation\Http\FormRequest;

class EditTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('edit', $this->route('task')) ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [];
    }
}
