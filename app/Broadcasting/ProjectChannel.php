<?php

namespace App\Broadcasting;

use App\Models\User;

class ProjectChannel
{
    public function join(User $user, string $projectId): array | null
    {
        if ($user->projects()->where('project_id', $projectId)->exists()) {
            return [
                'id' => $user->id,
                'name' => $user->name,
            ];
        }

        return null;
    }
}
