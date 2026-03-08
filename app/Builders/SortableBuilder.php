<?php

declare(strict_types=1);

namespace App\Builders;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * @template TModel of Model
 *
 * @extends Builder<TModel>
 */
class SortableBuilder extends Builder
{
    public function __construct(
        QueryBuilder $query,
        private readonly string $sortableField = 'position',
    ) {
        parent::__construct($query);
    }

    public function sorted(): static
    {
        $this->orderBy($this->sortableField);

        return $this;
    }
}