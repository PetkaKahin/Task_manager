<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            Schema::table('project_user', function (Blueprint $table) {
                $table->string('position')->charset('utf8mb4')->collation('utf8mb4_bin')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            Schema::table('project_user', function (Blueprint $table) {
                $table->string('position')->nullable()->change();
            });
        }
    }
};