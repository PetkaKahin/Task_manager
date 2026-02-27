<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $driver = DB::getDriverName();

            $table->id();
            if ($driver === 'mysql' || $driver === 'mariadb') {
                $table->string('position')->charset('utf8mb4')->collation('utf8mb4_bin')->index();
            } else {
                $table->string('position')->index();
            }
            $table->text('content')->nullable();
            $table->unsignedBigInteger('category_id')->index();
            $table->timestamps();
            $table->softDeletes()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
