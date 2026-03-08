<?php

declare(strict_types=1);

use App\Broadcasting\ProjectChannel;
use App\Models\Project;
use App\Models\User;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

// ─── Project.{id} (presence channel, ProjectChannel class) ───────────────────

test('project channel grants access to project member', function () {
    $user    = User::factory()->create();
    $project = Project::factory()->create();
    $user->projects()->attach($project->id);

    $channel = new ProjectChannel();
    $result  = $channel->join($user, (string) $project->id);

    expect($result)->toBe(['id' => $user->id, 'name' => $user->name]);
});

test('project channel denies access to non-member', function () {
    $user    = User::factory()->create();
    $project = Project::factory()->create();

    $channel = new ProjectChannel();
    $result  = $channel->join($user, (string) $project->id);

    expect($result)->toBeNull();
});

// ─── User.{id} (private channel, closure) ────────────────────────────────────

/**
 * Retrieve the registered callback for the given channel name.
 * Channels are stored in the base Broadcaster's protected $channels array.
 */
function resolveChannelCallback(string $channelName): callable
{
    $broadcaster = app(Illuminate\Broadcasting\BroadcastManager::class)->driver();

    $reflection = new ReflectionProperty($broadcaster, 'channels');
    $reflection->setAccessible(true);
    $channels = $reflection->getValue($broadcaster);

    return $channels[$channelName];
}

test('user channel grants access to own channel', function () {
    $user     = User::factory()->create();
    $callback = resolveChannelCallback('User.{id}');

    expect($callback($user, $user->id))->toBeTrue();
});

test('user channel denies access to another user channel', function () {
    $user     = User::factory()->create();
    $other    = User::factory()->create();
    $callback = resolveChannelCallback('User.{id}');

    expect($callback($user, $other->id))->toBeFalse();
});