<?php

declare(strict_types=1);

namespace App\Events\Task;

use App\Models\Category;
use App\Models\Task;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ReorderedTask implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    /**
     * @param Category $category
     */
    public function __construct(
        private readonly Category $category,
    ) {
        $this->category->loadMissing('tasks');
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'category_id' => $this->category->id,
            'task_ids' => $this->getSortedTaskIds(),
            'initiator_id' => auth()->id(), // фронтенд сам достанет данные, если надо
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
            new PresenceChannel("Project.{$this->category->project_id}"),
        ];
    }

    /**
     * @return array<int>
     */
    private function getSortedTaskIds(): array
    {
        /** @var array<int> */
        return Task::sorted()->where('category_id', $this->category->id)->pluck('id')->all();
    }
}
