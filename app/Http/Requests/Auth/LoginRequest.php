<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'login' => [
                'required',
                'string',
                'max:255',
            ],
            'password' => [
                'required',
                'string',
            ],
        ];
    }

    public function authenticate(): void
    {
        $loginType = filter_var($this->login, FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'name';

        if (! Auth::attempt([
            $loginType => $this->login,
            'password' => $this->password,
        ])) {
            throw ValidationException::withMessages([
                'error' => __('auth.failed'),
            ]);
        }
    }
}
