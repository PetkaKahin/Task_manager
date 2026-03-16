<?php

namespace App\Providers;

use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\CategoryRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\TaskRepository;
use App\Repositories\UserRepository;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /** @var array<string, string> */
    public array $bindings = [
        ProjectRepositoryInterface::class => ProjectRepository::class,
        CategoryRepositoryInterface::class => CategoryRepository::class,
        TaskRepositoryInterface::class => TaskRepository::class,
        UserRepositoryInterface::class => UserRepository::class,
    ];

    /**
     * @return int[]|string[]
     */
    public function provides(): array
    {
        return array_keys($this->bindings);
    }
}
