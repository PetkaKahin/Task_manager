<?php

declare(strict_types=1);

namespace Auth\Web;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Форма входа доступна.
     */
    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    /**
     * Пользователь может войти с правильным name.
     */
    public function test_users_can_name_authenticate(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'login' => $user->name,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard'));
    }

    /**
     * Пользователь может войти с правильным email.
     */
    public function test_users_can_email_authenticate(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'login' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard'));
    }

    /**
     * Вход с неверным паролем отклоняется.
     */
    public function test_users_cannot_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'login' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors();
    }

    /**
     * Вход с несуществующим email отклоняется.
     */
    public function test_users_cannot_authenticate_with_nonexistent_email(): void
    {
        $response = $this->post('/login', [
            'login' => 'nonexistent@example.com',
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors();
    }

    /**
     * Вход с несуществующим name отклоняется.
     */
    public function test_users_cannot_authenticate_with_nonexistent_name(): void
    {
        $response = $this->post('/login', [
            'login' => 'noName',
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors();
    }

    /**
     * Авторизованный пользователь редиректится с формы входа.
     */
    public function test_authenticated_user_redirected_from_login(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/login');

        $response->assertRedirect(route('dashboard'));
    }
}
