<?php

declare(strict_types=1);

namespace App\Events\Project;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DeletedProject implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    public function __construct(
        private int $userId,
        private int $projectId,
    ) {
    }

    /**
     * @return array<string, int>
     */
    public function broadcastWith(): array
    {
        return [
            'projectId' => $this->projectId,
        ];
    }

    public function broadcastAs(): string
    {
        return 'Project.DeletedProject';
    }

    /**
     * @return PrivateChannel[]
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("User.{$this->userId}"),
        ];
    }
}
