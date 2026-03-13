<?php

declare(strict_types=1);

namespace App\Events\Project;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ReorderedProject implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'project_ids' => $this->getSortedProjectIds(),
            'initiator_id' => auth()->id(), // фронтенд сам достанет данные, если надо
        ];
    }

    public function broadcastAs(): string
    {
        return 'Project.ReorderedProject';
    }

    /**
     * @return PrivateChannel[]
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("User." . auth()->id()),
        ];
    }

    /**
     * @return int[]
     */
    public function getSortedProjectIds(): array
    {
        /** @var User $user */
        $user = auth()->user();

        /** @var int[] */
        return $user->projects()->pluck('projects.id')->all();
    }
}
