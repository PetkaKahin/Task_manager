<?php

namespace App\Events\Project;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DeletedProject implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        private int $userId,
        private int $projectId,
    ) {}

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

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("User.{$this->userId}"),
        ];
    }
}