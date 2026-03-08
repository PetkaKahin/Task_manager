<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\User;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guest is redirected to login', function () {
    $this->get(route('home'))
        ->assertRedirect(route('login'));
});

test('authenticated user with no projects is redirected to projects.create', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('home'))
        ->assertRedirect(route('projects.create'));
});

test('authenticated user with projects is redirected to first project', function () {
    $user    = User::factory()->create();
    $project = Project::factory()->create();
    $user->projects()->attach($project->id);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertRedirect(route('projects.show', $project->id));
});