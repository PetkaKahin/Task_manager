<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\User;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

function projectWithOwner(): array
{
    $user    = User::factory()->withFirstProject()->create();
    $project = $user->projects()->first();

    return [$user, $project];
}

// ─── show ─────────────────────────────────────────────────────────────────────

test('owner can show project', function () {
    [$owner, $project] = projectWithOwner();

    expect($owner->can('show', $project))->toBeTrue();
});

test('non-owner cannot show project', function () {
    [, $project] = projectWithOwner();
    $other = User::factory()->create();

    expect($other->can('show', $project))->toBeFalse();
});

// ─── edit ─────────────────────────────────────────────────────────────────────

test('owner can edit project', function () {
    [$owner, $project] = projectWithOwner();

    expect($owner->can('edit', $project))->toBeTrue();
});

test('non-owner cannot edit project', function () {
    [, $project] = projectWithOwner();
    $other = User::factory()->create();

    expect($other->can('edit', $project))->toBeFalse();
});

// ─── update ───────────────────────────────────────────────────────────────────

test('owner can update project', function () {
    [$owner, $project] = projectWithOwner();

    expect($owner->can('update', $project))->toBeTrue();
});

test('non-owner cannot update project', function () {
    [, $project] = projectWithOwner();
    $other = User::factory()->create();

    expect($other->can('update', $project))->toBeFalse();
});

// ─── delete ───────────────────────────────────────────────────────────────────

test('owner can delete project', function () {
    [$owner, $project] = projectWithOwner();

    expect($owner->can('delete', $project))->toBeTrue();
});

test('non-owner cannot delete project', function () {
    [, $project] = projectWithOwner();
    $other = User::factory()->create();

    expect($other->can('delete', $project))->toBeFalse();
});

// ─── edge cases ───────────────────────────────────────────────────────────────

test('user with own project cannot access another project', function () {
    [, $project]        = projectWithOwner();
    $otherUser = User::factory()->withFirstProject()->create();

    expect($otherUser->can('show', $project))->toBeFalse();
    expect($otherUser->can('update', $project))->toBeFalse();
    expect($otherUser->can('delete', $project))->toBeFalse();
});

test('unattached project is not accessible', function () {
    $user    = User::factory()->create();
    $project = Project::factory()->create();

    expect($user->can('show', $project))->toBeFalse();
    expect($user->can('edit', $project))->toBeFalse();
    expect($user->can('update', $project))->toBeFalse();
    expect($user->can('delete', $project))->toBeFalse();
});