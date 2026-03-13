<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\JsonApi\AnonymousResourceCollection;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property int $project_id
 * @property AnonymousResourceCollection $tasks
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class CategoryResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'project_id' => $this->project_id,
            // Загрузил tasks — они в ответе. Не загрузил — ключа tasks нет вообще
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
