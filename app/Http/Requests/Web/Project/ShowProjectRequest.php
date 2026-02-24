<?php

namespace App\Http\Requests\Web\Project;

use Illuminate\Foundation\Http\FormRequest;

class ShowProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('show', $this->route('project'));
    }

    public function rules(): array
    {
        return [];
    }
}
