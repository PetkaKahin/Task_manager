<?php

namespace App\Providers;

use App\Auth\CachedUserProvider;
use App\Models\Project;
use App\Models\Task;
use App\Repositories\ProjectRepository;
use App\Repositories\TaskRepository;
use App\Repositories\UserRepository;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Auth::provider('cached', function (Application $app, array $config): CachedUserProvider {
            return new CachedUserProvider(
                $app->make(UserRepository::class),
                $app->make('hash'),
                $config['model'],
            );
        });

        Route::bind('project', function (string $id): Project {
            return app(ProjectRepository::class)->find((int) $id) ?? abort(404);
        });

        Route::bind('task', function (string $id): Task {
            return app(TaskRepository::class)->find((int) $id) ?? abort(404);
        });
    }
}
