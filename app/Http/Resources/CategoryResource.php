<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'title'      => $this->title,
            'project_id' => $this->project_id,
            'tasks'      => $this->tasks,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
