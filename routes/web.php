<?php

use App\Http\Controllers\Web\Auth\LoginController;
use App\Http\Controllers\Web\Auth\LogoutController;
use App\Http\Controllers\Web\Auth\RegisterController;
use App\Http\Controllers\Web\User\CategoryController;
use App\Http\Controllers\Web\User\ProjectController;
use App\Http\Controllers\Web\User\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (!Auth::check()) return redirect()->route('login');

    $project = auth()->user()->projects()->first();

    if ($project == null) return redirect()->route('projects.create');

    return redirect()->route('projects.show', $project->id);
})->name('home');

Route::middleware(['guest', 'throttle:60,1'])->group(function () {
    Route::get('register', [RegisterController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisterController::class, 'store']);

    Route::get('login', [LoginController::class, 'create'])
        ->name('login');
    Route::post('login', [LoginController::class, 'store']);
});

Route::middleware('auth:web')->group(function () {
    Route::resource('projects', ProjectController::class)->only(['show', 'edit', 'update', 'store', 'destroy', 'create']);
    Route::resource('categories', CategoryController::class)->only(['edit', 'update', 'store', 'destroy', 'create']);
    Route::resource('tasks', TaskController::class)->only(['edit', 'update', 'store', 'destroy', 'create']);

    Route::post('logout', [LogoutController::class, 'destroy'])->name('logout');
});
