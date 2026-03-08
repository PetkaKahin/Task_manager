<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use AlexCrawford\Sortable\BelongsToSortedMany;
use AlexCrawford\Sortable\BelongsToSortedManyTrait;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;
    use Notifiable;
    use HasApiTokens;
    use BelongsToSortedManyTrait;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /** @return BelongsToSortedMany<Project, $this> */
    public function projects(): BelongsToSortedMany
    {
        return $this->belongsToSortedMany(Project::class)
            ->withPivot('role')
            ->withTimestamps();
    }
}
