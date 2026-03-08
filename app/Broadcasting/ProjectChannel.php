<?php

declare(strict_types=1);

namespace App\Broadcasting;

use App\Models\User;

class ProjectChannel
{
    /**
     * @return array<string, int|string>|null
     */
    public function join(User $user, string $projectId): array | null
    {
        if ($user->projects()->wherePivot('project_id', $projectId)->exists()) {
            return [
                'id' => $user->id,
                'name' => $user->name,
            ];
        }

        return null;
    }
}
