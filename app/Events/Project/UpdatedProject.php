<?php

declare(strict_types=1);

namespace App\Events\Project;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class UpdatedProject implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    public function __construct(
        private readonly int $userId,
        public readonly int $id,
        public readonly string $title,
    ) {
    }

    /**
     * @return array<string, array<string, int|string>>
     */
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
