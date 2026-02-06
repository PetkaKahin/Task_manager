<?php

declare(strict_types=1);

namespace Auth\Web;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LogoutTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Авторизованный пользователь может выйти.
     */
    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect(route('home'));
    }

    /**
     * Выход требует POST (защита от CSRF).
     */
    public function test_logout_requires_post(): void
    {
        $user = User::factory()->create();

        // GET-запрос на logout не должен работать
        $response = $this->actingAs($user)->get('/logout');

        // 405 Method Not Allowed
        $response->assertStatus(405);

        // Пользователь всё ещё авторизован
        $this->assertAuthenticated();
    }

    /**
     * Гость не может выйти (уже не залогинен).
     */
    public function test_guest_cannot_logout(): void
    {
        $response = $this->post('/logout');

        // Редирект на логин, т.к. маршрут защищён auth middleware
        $response->assertRedirect(route('login'));
    }
}
