<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class UserRepository implements UserRepositoryInterface
{
    public function find(int $id): ?User
    {
        $raw = Cache::tags(["user:{$id}"])
            ->remember(
                "user:{$id}",
                now()->addHour(),
                fn () => User::query()->find($id)?->getAttributes()
            );

        return $raw ? (new User)->newFromBuilder($raw) : null;
    }

    public function clearCache(User $user): void
    {
        Cache::tags(["user:{$user->id}"])->flush();
    }
}