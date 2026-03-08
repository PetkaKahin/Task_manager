<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Project;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property int|null $move_after_id
 */
class ReorderProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('project')) ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'move_after_id' => [
                'nullable',
                'integer',
                Rule::exists('projects', 'id')->whereNull('deleted_at'),
            ],
        ];
    }
}
