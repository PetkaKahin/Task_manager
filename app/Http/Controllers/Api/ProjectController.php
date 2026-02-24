<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;

class ProjectController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $projects = $user->projects()->orderByDesc('updated_at')->get();

        return ProjectResource::collection($projects)->resolve();
    }
}
