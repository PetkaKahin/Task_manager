<?php

namespace App\Events\Task;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ReorderedTask implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    /**
     * @param int $projectId
     * @param int $categoryId
     * @param int[] $taskIds Отсортированные ID тасок в категории
     */
    public function __construct(
        private int $projectId,
        public readonly int $categoryId,
        public readonly array $taskIds,
    ) {}

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

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->projectId}"),
        ];
    }
}