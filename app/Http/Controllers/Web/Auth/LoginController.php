<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $this->authenticate($request);
        $request->session()->regenerate();

        $user = Auth::user();
        $project = $user->projects()->first();

        return redirect()->intended(route("dashboard.index", $project?->id));
    }

    protected function authenticate(LoginRequest $request): void
    {
        $credentials = $request->validated();
        $loginType = $this->getLoginType($credentials['login']);

        if (!Auth::attempt([
            $loginType => $credentials['login'],
            'password' => $credentials['password']
        ])) {
            throw ValidationException::withMessages([
                'error' => __('auth.failed'),
            ]);
        }
    }

    protected function getLoginType(string $login): string
    {
        return filter_var($login, FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'name';
    }
}
