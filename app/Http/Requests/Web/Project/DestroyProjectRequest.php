<?php

namespace App\Http\Requests\Web\Project;

use Illuminate\Foundation\Http\FormRequest;

class DestroyProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('delete', $this->route('project'));
    }

    public function rules(): array
    {
        return [];
    }
}
