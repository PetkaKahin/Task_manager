<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\User;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

function categoryWithOwner(): array
{
    $user     = User::factory()->withFirstProject()->create();
    $project  = $user->projects()->first();
    $category = $project->categories()->first();

    return [$user, $category];
}

// ─── show ─────────────────────────────────────────────────────────────────────

test('owner can show category', function () {
    [$owner, $category] = categoryWithOwner();

    expect($owner->can('show', $category))->toBeTrue();
});

test('non-owner cannot show category', function () {
    [, $category] = categoryWithOwner();
    $other = User::factory()->create();

    expect($other->can('show', $category))->toBeFalse();
});

// ─── edit ─────────────────────────────────────────────────────────────────────

test('owner can edit category', function () {
    [$owner, $category] = categoryWithOwner();

    expect($owner->can('edit', $category))->toBeTrue();
});

test('non-owner cannot edit category', function () {
    [, $category] = categoryWithOwner();
    $other = User::factory()->create();

    expect($other->can('edit', $category))->toBeFalse();
});

// ─── update ───────────────────────────────────────────────────────────────────

test('owner can update category', function () {
    [$owner, $category] = categoryWithOwner();

    expect($owner->can('update', $category))->toBeTrue();
});

test('non-owner cannot update category', function () {
    [, $category] = categoryWithOwner();
    $other = User::factory()->create();

    expect($other->can('update', $category))->toBeFalse();
});

// ─── delete ───────────────────────────────────────────────────────────────────

test('owner can delete category', function () {
    [$owner, $category] = categoryWithOwner();

    expect($owner->can('delete', $category))->toBeTrue();
});

test('non-owner cannot delete category', function () {
    [, $category] = categoryWithOwner();
    $other = User::factory()->create();

    expect($other->can('delete', $category))->toBeFalse();
});

// ─── edge cases ───────────────────────────────────────────────────────────────

test('user with different project cannot access category', function () {
    [, $category] = categoryWithOwner();
    $otherUser = User::factory()->withFirstProject()->create();

    expect($otherUser->can('show', $category))->toBeFalse();
    expect($otherUser->can('update', $category))->toBeFalse();
    expect($otherUser->can('delete', $category))->toBeFalse();
});