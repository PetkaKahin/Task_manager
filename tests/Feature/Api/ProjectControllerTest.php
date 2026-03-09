<?php

declare(strict_types=1);

use App\Events\Project\ReorderedProject;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Event;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

// Хелпер: пользователь с N проектами, привязанными через pivot (position проставляется автоматически)
function userWithProjects(int $count = 2): array
{
    $user     = User::factory()->create();
    $projects = Project::factory()->count($count)->create();

    foreach ($projects as $project) {
        $user->projects()->attach($project->id);
    }

    return [$user, $user->projects()->get()];
}

// ─── index ───────────────────────────────────────────────────────────────────

test('returns all projects for authenticated user', function () {
    [$user, $projects] = userWithProjects(3);

    $this->actingAs($user)
        ->getJson(route('api.projects.index'))
        ->assertOk()
        ->assertJsonCount(3)
        ->assertJsonStructure([['id', 'title', 'position']]);
});

test('index does not return other users projects', function () {
    [$user] = userWithProjects(2);
    userWithProjects(3); // другой пользователь

    $this->actingAs($user)
        ->getJson(route('api.projects.index'))
        ->assertOk()
        ->assertJsonCount(2);
});

test('index returns 401 for guest', function () {
    $this->getJson(route('api.projects.index'))
        ->assertUnauthorized();
});

// ─── reorder ─────────────────────────────────────────────────────────────────

test('owner can move project to first position', function () {
    Event::fake();

    [$user, $projects] = userWithProjects(3);
    $last = $projects->last();

    $this->actingAs($user)
        ->patchJson(route('api.projects.reorder', $last), ['move_after_id' => null])
        ->assertOk();

    $first = $user->projects()->first();
    expect($first->id)->toBe($last->id);
});

test('owner can move project after another', function () {
    Event::fake();

    [$user, $projects] = userWithProjects(3);
    $first  = $projects->first();
    $second = $projects->get(1);
    $third  = $projects->last();

    $this->actingAs($user)
        ->patchJson(route('api.projects.reorder', $first), ['move_after_id' => $third->id])
        ->assertOk();

    $sorted = $user->projects()->pluck('projects.id')->all();
    expect($sorted)->toBe([$second->id, $third->id, $first->id]);
});

test('reorder broadcasts ReorderedProject only to acting user', function () {
    Event::fake();

    [$user, $projects] = userWithProjects(2);
    $otherUser = User::factory()->create();
    $last = $projects->last();
    $otherUser->projects()->attach($last->id);

    $this->actingAs($user)
        ->patchJson(route('api.projects.reorder', $last), ['move_after_id' => null]);

    Event::assertDispatched(ReorderedProject::class, function ($event) use ($user, $otherUser) {
        $channels = array_map(fn($ch) => $ch->name, $event->broadcastOn());

        return in_array("private-User.{$user->id}", $channels)
            && ! in_array("private-User.{$otherUser->id}", $channels);
    });
});

test('reorder returns 403 for non-owner', function () {
    [$user, $projects] = userWithProjects(2);
    $other = User::factory()->create();

    $this->actingAs($other)
        ->patchJson(route('api.projects.reorder', $projects->first()), ['move_after_id' => null])
        ->assertForbidden();
});

test('reorder returns 401 for guest', function () {
    [$user, $projects] = userWithProjects(2);

    $this->patchJson(route('api.projects.reorder', $projects->first()), ['move_after_id' => null])
        ->assertUnauthorized();
});

test('reorder returns 422 when move_after_id does not exist', function () {
    [$user, $projects] = userWithProjects(2);

    $this->actingAs($user)
        ->patchJson(route('api.projects.reorder', $projects->first()), ['move_after_id' => 99999])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('move_after_id');
});