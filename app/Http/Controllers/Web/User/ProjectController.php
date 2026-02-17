<?php

namespace App\Http\Controllers\Web\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Project\StoreProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {

    }

    public function create()
    {
        $user = auth()->user();
        $projects = $user->projects()->get();

        return Inertia::render('User/NewProject', [
            'projects' => $projects,
        ]);
    }

    public function store(StoreProjectRequest $request)
    {
        $user = auth()->user();
        $newProject = Project::factory()->default($user, $request->title)->create();

        return redirect(route('dashboard.index', $newProject->id));
    }

    public function show(string $id)
    {

    }

    public function edit(string $id)
    {

    }

    public function update(Request $request, string $id)
    {

    }

    public function destroy(string $id)
    {

    }
}
