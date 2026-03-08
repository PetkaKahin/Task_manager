<?php

declare(strict_types=1);

namespace App\Events\Task;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ReorderedTask implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    /**
     * @param int $projectId
     * @param int $categoryId
     * @param int[] $taskIds Отсортированные ID тасок в категории
     */
    public function __construct(
        private readonly int $projectId,
        public readonly int $categoryId,
        public readonly array $taskIds,
    ) {
    }

    /**
     * @return array<string, int|array<int>>
     */
    public function broadcastWith(): array
    {
        return [
            'categoryId' => $this->categoryId,
            'taskIds' => $this->taskIds,
        ];
    }

    public function broadcastAs(): string
    {
        return 'Task.ReorderedTask';
    }

    /**
     * @return PresenceChannel[]
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->projectId}"),
        ];
    }
}
