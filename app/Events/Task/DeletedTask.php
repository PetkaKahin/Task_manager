<?php

namespace App\Events\Task;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DeletedTask implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public readonly int $taskId;
    public readonly int $categoryId;
    private int $projectId;

    public function __construct(int $taskId, int $categoryId, int $projectId)
    {
        $this->taskId = $taskId;
        $this->categoryId = $categoryId;
        $this->projectId = $projectId;
    }

    public function broadcastAs(): string
    {
        return 'Task.DeletedTask';
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->projectId}"),
        ];
    }
}
