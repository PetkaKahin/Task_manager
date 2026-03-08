<?php

declare(strict_types=1);

namespace App\Events\Project;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ReorderedProject implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    /**
     * @param int $userId
     * @param int[] $projectIds
     */
    public function __construct(
        private readonly int $userId,
        public readonly array $projectIds,
    ) {
    }

    /**
     * @return array<string, array<int>>
     */
    public function broadcastWith(): array
    {
        return [
            'projectIds' => $this->projectIds,
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
            new PrivateChannel("User.{$this->userId}"),
        ];
    }
}
