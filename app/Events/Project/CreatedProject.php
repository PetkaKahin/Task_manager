<?php

declare(strict_types=1);

namespace App\Events\Project;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class CreatedProject implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    /**
     * @param int[] $userIds
     */
    public function __construct(
        private readonly array $userIds,
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
        return 'Project.CreatedProject';
    }

    /**
     * @return PrivateChannel[]
     */
    public function broadcastOn(): array
    {
        return array_map(
            fn (int $id) => new PrivateChannel("User.{$id}"),
            $this->userIds,
        );
    }
}
