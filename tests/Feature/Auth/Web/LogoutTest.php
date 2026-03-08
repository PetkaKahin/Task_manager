<?php

declare(strict_types=1);

use App\Models\User;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

test('authenticated user can logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('logout'))
        ->assertRedirect(route('login'));

    $this->assertGuest();
});

test('logout invalidates session', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('logout'));

    $this->assertGuest();
});

test('guest cannot access logout route', function () {
    $this->post(route('logout'))->assertRedirect(route('login'));
});