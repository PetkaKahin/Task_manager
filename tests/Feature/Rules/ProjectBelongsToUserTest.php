<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\User;
use App\Rules\ProjectBelongsToUser;
use Illuminate\Support\Facades\Auth;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

function projectFailMessage(): string
{
    return trans('messages.project_not_found');
}

function runProjectRule(mixed $value): ?string
{
    $rule   = new ProjectBelongsToUser();
    $failed = null;

    $rule->validate('project_id', $value, function (string $msg) use (&$failed) {
        $failed = $msg;
    });

    return $failed;
}

// ─── passes ───────────────────────────────────────────────────────────────────

test('passes when project belongs to authenticated user', function () {
    $user    = User::factory()->withFirstProject()->create();
    $project = $user->projects()->first();

    Auth::login($user);

    expect(runProjectRule($project->id))->toBeNull();
});

test('passes when value is null', function () {
    $user = User::factory()->create();
    Auth::login($user);

    expect(runProjectRule(null))->toBeNull();
});

// ─── fails ────────────────────────────────────────────────────────────────────

test('fails when project does not belong to authenticated user', function () {
    $user    = User::factory()->withFirstProject()->create();
    $project = $user->projects()->first();

    $other = User::factory()->create();
    Auth::login($other);

    expect(runProjectRule($project->id))->toBe(projectFailMessage());
});

test('fails when project id does not exist', function () {
    $user = User::factory()->create();
    Auth::login($user);

    expect(runProjectRule(99999))->toBe(projectFailMessage());
});

test('fails when project is soft-deleted', function () {
    $user    = User::factory()->withFirstProject()->create();
    $project = $user->projects()->first();

    $project->delete();
    Auth::login($user);

    expect(runProjectRule($project->id))->toBe(projectFailMessage());
});

test('fails when user has no projects at all', function () {
    $user    = User::factory()->create();
    $project = Project::factory()->create();

    Auth::login($user);

    expect(runProjectRule($project->id))->toBe(projectFailMessage());
});