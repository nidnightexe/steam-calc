<?php

use App\Http\Controllers\SteamCalculatorController;
use Illuminate\Support\Facades\Route;

Route::get('/', [SteamCalculatorController::class, 'index'])->name('home');
Route::post('/steam-calculator/check', [SteamCalculatorController::class, 'processForm'])->name('steam.process');
Route::get('/profile/{steamId}', [SteamCalculatorController::class, 'show'])->name('steam.show');


// require __DIR__.'/settings.php';

Route::get('/image-proxy', function (Illuminate\Http\Request $request) {
    $url = $request->query('url');
    if (!$url) return abort(400);

    try {
        $response = Illuminate\Support\Facades\Http::withoutVerifying()
            ->withHeaders(['User-Agent' => 'Mozilla/5.0'])
            ->get($url);
            
        if ($response->failed()) return abort(404);

        return response($response->body())
            ->header('Content-Type', $response->header('Content-Type'))
            ->header('Access-Control-Allow-Origin', '*'); // Kunci sukses CORS
    } catch (\Exception $e) {
        return abort(500);
    }
})->name('image.proxy');