<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Auth\RegisterRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = User::factory()->unverified()->withFirstProject()->create($request->validated());

        Auth::login($user);
        $request->session()->regenerate();

        /** @var Project|null $project */
        $project = $user->projects()->orderBy('position')->first();

        if (!$project) {
            abort(404);
        }

        return redirect()->intended(route('projects.show', $project->id));
    }
}
