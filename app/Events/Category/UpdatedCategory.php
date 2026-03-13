<?php

declare(strict_types=1);

namespace App\Events\Category;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class UpdatedCategory implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    public function __construct(
        private readonly Category $category,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'category' => CategoryResource::make($this->category)->resolve(),
            'initiator_id' => auth()->id(), // фронтенд сам достанет данные, если надо
        ];
    }

    public function broadcastAs(): string
    {
        return 'Category.UpdatedCategory';
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->category->project_id}"),
        ];
    }
}
