<?php

namespace App\Http\Controllers\Web\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(int $ProjectId): Response
    {
        $user = auth()->user();
        $project = $user->projects()->findOrFail($ProjectId);
        $categories = $project->categories()->sorted()
            ->with(['tasks' => fn ($query) => $query->sorted()])
            ->get();

        return Inertia::render('User/Dashboard', [
            'project'    => $project,
            'categories' => $categories,
        ]);
    }
}
