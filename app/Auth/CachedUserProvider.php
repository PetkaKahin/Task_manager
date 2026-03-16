<?php

declare(strict_types=1);

namespace App\Auth;

use App\Repositories\UserRepository;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Hashing\Hasher;

class CachedUserProvider extends EloquentUserProvider
{
    public function __construct(
        private readonly UserRepository $userRepository,
        Hasher $hasher,
        string $model,
    ) {
        parent::__construct($hasher, $model);
    }

    public function retrieveById($identifier): ?Authenticatable
    {
        return $this->userRepository->find((int) $identifier);
    }
}