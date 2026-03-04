<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use AlexCrawford\LexoRank\Rank;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        Schema::table('project_user', function (Blueprint $table) use ($driver) {
            if ($driver === 'mysql' || $driver === 'mariadb') {
                $table->string('position')->nullable()->charset('utf8mb4')->collation('utf8mb4_bin')->after('role');
            } else {
                $table->string('position')->nullable()->after('role');
            }
        });

        // Migrate existing positions from projects table to pivot
        $pivotRows = DB::table('project_user')->orderBy('user_id')->get();
        $perUser = $pivotRows->groupBy('user_id');

        foreach ($perUser as $userId => $rows) {
            $position = null;
            foreach ($rows as $row) {
                // Get original position from projects table
                $projectPosition = DB::table('projects')->where('id', $row->project_id)->value('position');

                if ($projectPosition) {
                    $position = $projectPosition;
                } else {
                    $position = $position === null
                        ? Rank::forEmptySequence()->get()
                        : Rank::after(Rank::fromString($position))->get();
                }

                DB::table('project_user')
                    ->where('project_id', $row->project_id)
                    ->where('user_id', $row->user_id)
                    ->update(['position' => $position]);
            }
        }

        // Make position NOT NULL and add index after data migration
        Schema::table('project_user', function (Blueprint $table) {
            $table->string('position')->nullable(false)->index()->change();
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('position');
        });
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        Schema::table('projects', function (Blueprint $table) use ($driver) {
            if ($driver === 'mysql' || $driver === 'mariadb') {
                $table->string('position')->charset('utf8mb4')->collation('utf8mb4_bin')->index()->after('title');
            } else {
                $table->string('position')->index()->after('title');
            }
        });

        $pivotRows = DB::table('project_user')->orderBy('project_id')->get();
        $seen = [];
        foreach ($pivotRows as $row) {
            if (!isset($seen[$row->project_id])) {
                DB::table('projects')->where('id', $row->project_id)->update(['position' => $row->position]);
                $seen[$row->project_id] = true;
            }
        }

        Schema::table('project_user', function (Blueprint $table) {
            $table->dropColumn('position');
        });
    }
};
