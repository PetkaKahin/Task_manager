<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_user', function (Blueprint $table) {
            $driver = DB::getDriverName();

            $table->unsignedBigInteger('project_id')->index();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('role')->default('member');
            if ($driver === 'mysql' || $driver === 'mariadb') {
                $table->string('position')->charset('utf8mb4')->collation('utf8mb4_bin')->nullable()->index();
            } else {
                $table->string('position')->nullable()->index();
            }
            $table->timestamps();
        });

        Schema::table('project_user', function (Blueprint $table) {
            $table->unique(['project_id', 'user_id']);
            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('project_user', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['user_id']);
        });

        Schema::dropIfExists('project_user');
    }
};
