<?php

use App\Http\Controllers\SteamCalculatorController;
use Illuminate\Support\Facades\Route;

Route::get('/', [SteamCalculatorController::class, 'index'])->name('home');
Route::post('/steam-calculator/check', [SteamCalculatorController::class, 'processForm'])->name('steam.process');
Route::get('/profile/{steamId}', [SteamCalculatorController::class, 'show'])->name('steam.show');


require __DIR__.'/settings.php';

