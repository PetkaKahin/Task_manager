<?php

namespace App\Events\Project;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class UpdatedProject implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        private int $userId,
        public readonly int $id,
        public readonly string $title,
    ) {}

    public function broadcastWith(): array
    {
        return [
            'project' => [
                'id' => $this->id,
                'title' => $this->title,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'Project.UpdatedProject';
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("User.{$this->userId}"),
        ];
    }
}