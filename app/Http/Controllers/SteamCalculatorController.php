<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Client\Pool; // Import ini penting
use Illuminate\Http\Client\Response;
use Inertia\Inertia;
use Carbon\Carbon;

class SteamCalculatorController extends Controller
{
    private $apiKey;
    private $rates = [
        'IDR' => ['rate' => 16000, 'symbol' => 'Rp ', 'locale' => 'id_ID'],
        'USD' => ['rate' => 1, 'symbol' => '$', 'locale' => 'en_US'],
        'EUR' => ['rate' => 0.92, 'symbol' => '€', 'locale' => 'de_DE'],
        'GBP' => ['rate' => 0.79, 'symbol' => '£', 'locale' => 'en_GB'],
        'JPY' => ['rate' => 150, 'symbol' => '¥', 'locale' => 'ja_JP'],
    ];

    public function __construct()
    {
        $this->apiKey = env('STEAM_API_KEY');
    }

    public function index()
    {
        return Inertia::render('SteamHome');
    }

    public function processForm(Request $request)
    {
        $request->validate([
            'steam_id' => 'required|string',
            'currency' => 'nullable|string|in:IDR,USD,EUR,GBP,JPY',
        ]);

        $input = $request->input('steam_id');
        $currency = $request->input('currency', 'IDR');
        $steamId = $this->resolveSteamId($input);

        if (!$steamId) {
            return back()->withErrors(['steam_id' => 'Steam ID tidak ditemukan.']);
        }

        return to_route('steam.show', ['steamId' => $steamId, 'currency' => $currency]);
    }

    public function show(Request $request, $steamId)
    {
        if (!is_numeric($steamId) || strlen($steamId) !== 17) {
             return to_route('home')->withErrors(['steam_id' => 'ID URL tidak valid.']);
        }

        $currencyCode = $request->query('currency', 'IDR');
        if (!array_key_exists($currencyCode, $this->rates)) {
            $currencyCode = 'IDR';
        }
        $selectedRate = $this->rates[$currencyCode];

        // Cache Key Unik
        $cacheKey = "steam_profile_{$steamId}_{$currencyCode}";

        // [OPTIMASI CACHE]
        $data = Cache::remember($cacheKey, 60, function () use ($steamId, $currencyCode, $selectedRate) {
            
            // 1. Cek Profile (Single Request untuk validasi awal)
            try {
                $playerSummary = Http::get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/", [
                    'key' => $this->apiKey,
                    'steamids' => $steamId
                ])->json()['response']['players'][0] ?? null;
            } catch (\Exception $e) {
                return null; // Signal error
            }

            if (!$playerSummary) return 'private'; // Signal private

            // 2. POOL REQUEST (PARALEL)
            // [FIX] Menggunakan full namespace '\Illuminate\Http\Client\Pool' untuk menghindari error TypeError
            $responses = Http::pool(fn (\Illuminate\Http\Client\Pool $pool) => [
                $pool->as('games')->get("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/", [
                    'key' => $this->apiKey, 'steamid' => $steamId, 'format' => 'json', 'include_appinfo' => true, 'include_played_free_games' => false
                ]),
                $pool->as('recent')->get("http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/", [
                    'key' => $this->apiKey, 'steamid' => $steamId, 'format' => 'json', 'count' => 3
                ]),
                $pool->as('badges')->get("http://api.steampowered.com/IPlayerService/GetBadges/v1/", [
                    'key' => $this->apiKey, 'steamid' => $steamId
                ]),
                $pool->as('bans')->get("http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/", [
                    'key' => $this->apiKey, 'steamids' => $steamId
                ]),
                $pool->as('profile_items')->get("https://api.steampowered.com/IPlayerService/GetProfileItemsEquipped/v1/", [
                    'key' => $this->apiKey, 'steamid' => $steamId
                ]),
                $pool->as('friend_ids')->get("http://api.steampowered.com/ISteamUser/GetFriendList/v0001/", [
                    'key' => $this->apiKey, 'steamid' => $steamId, 'relationship' => 'friend'
                ])
            ]);

            // Helper untuk mengambil JSON dengan aman dari Pool
            $safeJson = function($key) use ($responses) {
                $response = $responses[$key] ?? null;
                // Pastikan response ada dan sukses sebelum ambil json
                if ($response instanceof Response && $response->successful()) {
                    return $response->json();
                }
                return [];
            };

            $games = $safeJson('games')['response']['games'] ?? [];
            $recentGamesRaw = $safeJson('recent')['response']['games'] ?? [];
            $bansData = $safeJson('bans')['players'][0] ?? [];
            $badgesData = $safeJson('badges')['response'] ?? [];
            $profileItems = $safeJson('profile_items')['response'] ?? [];
            $friendsRaw = $safeJson('friend_ids')['friendslist']['friends'] ?? [];
            
            // Friends Detail (Request Terpisah untuk detail teman)
            $friendCount = count($friendsRaw);
            $topFriendIds = collect($friendsRaw)->take(12)->pluck('steamid')->implode(',');
            $friendsListDetailed = [];
            
            if ($topFriendIds) {
                try {
                    $friendsDetails = Http::get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/", [
                        'key' => $this->apiKey, 'steamids' => $topFriendIds
                    ])->json()['response']['players'] ?? [];
                    
                    $friendsListDetailed = collect($friendsDetails)->map(function($f) {
                        $status = 'Offline';
                        if (isset($f['gameextrainfo'])) $status = 'In-Game';
                        elseif (($f['personastate'] ?? 0) == 1) $status = 'Online';
                        elseif (($f['personastate'] ?? 0) > 1) $status = 'Busy';
                        
                        return [
                            'steamid' => $f['steamid'], 
                            'personaname' => $f['personaname'], 
                            'avatar' => $f['avatarmedium'],
                            'profileurl' => $f['profileurl'], 
                            'personastate' => $f['personastate'] ?? 0, 
                            'status_label' => $status
                        ];
                    })->values();
                } catch (\Exception $e) { }
            }

            // Level & XP
            $steamLevel = $badgesData['player_level'] ?? 0;
            $playerXp = $badgesData['player_xp'] ?? 0;
            $xpNeeded = $badgesData['player_xp_needed_to_level_up'] ?? 0;
            $totalBadges = count($badgesData['badges'] ?? []);

            // Frame URL
            $frameUrl = null;
            if (isset($profileItems['avatar_frame'])) {
                $imageHash = $profileItems['avatar_frame']['image_large'] ?? $profileItems['avatar_frame']['image_small'] ?? null;
                if ($imageHash) $frameUrl = "https://community.cloudflare.steamstatic.com/economy/image/" . $imageHash;
            }

            // Stats Calculation
            $totalPlaytimeMinutes = collect($games)->sum('playtime_forever');
            $totalPlaytimeHours = round($totalPlaytimeMinutes / 60, 1);
            $totalGames = count($games);
            $neverPlayed = collect($games)->where('playtime_forever', 0)->count();
            $playedCount = $totalGames - $neverPlayed;
            $playedPercentage = $totalGames > 0 ? round(($playedCount / $totalGames) * 100) : 0;
            
            $basePriceUsd = 10; 
            $convertedTotal = ($totalGames * $basePriceUsd) * $selectedRate['rate'];
            
            $formattedValue = $currencyCode === 'IDR' 
                ? 'Rp ' . number_format($convertedTotal, 0, ',', '.') 
                : $selectedRate['symbol'] . number_format($convertedTotal, 0, '.', ',');
            
            $pricePerHourVal = $totalPlaytimeHours > 0 ? ($convertedTotal / $totalPlaytimeHours) : 0;
            $formattedPPH = $currencyCode === 'IDR' 
                ? 'Rp ' . number_format($pricePerHourVal, 0, ',', '.') 
                : $selectedRate['symbol'] . number_format($pricePerHourVal, 2, '.', ',');
            
            $avgPlaytime = $totalGames > 0 ? round($totalPlaytimeHours / $totalGames, 1) : 0;

            $createdAt = isset($playerSummary['timecreated']) ? Carbon::createFromTimestamp($playerSummary['timecreated']) : null;
            $accountAge = $createdAt ? round($createdAt->floatDiffInYears(now()), 1) . ' Yaers' : 'N/A';
            $creationDate = $createdAt ? $createdAt->format('d M Y') : 'N/A';
            $lastLogoff = isset($playerSummary['lastlogoff']) ? Carbon::createFromTimestamp($playerSummary['lastlogoff'])->diffForHumans() : 'Unknown';

            $gamerClass = 'Casual';
            if ($totalPlaytimeHours > 500) $gamerClass = 'Gamer';
            if ($totalPlaytimeHours > 2000) $gamerClass = 'Hardcore';
            if ($totalPlaytimeHours > 5000) $gamerClass = 'Elite';
            if ($totalPlaytimeHours > 10000) $gamerClass = 'No Life'; 

            $steamId64 = (int)$steamId;
            $baseId = 76561197960265728;
            $accountId = $steamId64 - $baseId;
            $steamId3 = "[U:1:$accountId]";
            $y = $accountId % 2;
            $z = ($accountId - $y) / 2;
            $steamId2 = "STEAM_0:$y:$z";

            // Top Games & Achievement (Parallel Logic)
            $topGamesCollection = collect($games)->sortByDesc('playtime_forever')->take(5)->values();
            $heroImage = null;
            $topGames = [];

            if ($topGamesCollection->count() > 0) {
                $topAppId = $topGamesCollection[0]['appid'];
                $heroImage = "https://steamcdn-a.akamaihd.net/steam/apps/$topAppId/library_hero.jpg";
                
                $topAppIds = $topGamesCollection->pluck('appid')->toArray();
                
                // [FIX] Gunakan full namespace di sini juga
                $responsesAch = Http::pool(fn (\Illuminate\Http\Client\Pool $pool) => 
                    collect($topAppIds)->map(fn ($appid) => 
                        $pool->as((string)$appid)->get("http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/", [
                            'appid' => $appid, 'key' => $this->apiKey, 'steamid' => $steamId
                        ])
                    )
                );
                
                $topGames = $topGamesCollection->map(function($game) use ($responsesAch) {
                    $appid = (string)$game['appid'];
                    $achievementData = null;
                    $res = $responsesAch[$appid] ?? null;
                    
                    if ($res instanceof Response && $res->successful()) {
                        $achStats = $res->json()['playerstats'] ?? null;
                        if ($achStats && isset($achStats['achievements'])) {
                            $total = count($achStats['achievements']);
                            $unlocked = collect($achStats['achievements'])->where('achieved', 1)->count();
                            $percentage = $total > 0 ? round(($unlocked / $total) * 100) : 0;
                            
                            // Ambil sample names
                            $unlockedList = collect($achStats['achievements'])->where('achieved', 1);
                            $sampleNames = $unlockedList->take(5)->pluck('apiname')->values()->toArray();

                            $achievementData = [
                                'total' => $total, 
                                'unlocked' => $unlocked, 
                                'percentage' => $percentage,
                                'samples' => $sampleNames
                            ];
                        }
                    }
                    return [
                        'name' => $game['name'], 
                        'appid' => $game['appid'], 
                        'playtime_hours' => round($game['playtime_forever'] / 60, 1),
                        'icon_url' => "http://media.steampowered.com/steamcommunity/public/images/apps/{$game['appid']}/{$game['img_icon_url']}.jpg",
                        'achievement' => $achievementData
                    ];
                });
            }

            $recentGames = collect($recentGamesRaw)->map(function($game) {
                 return [
                    'name' => $game['name'], 'playtime_2weeks' => round($game['playtime_2weeks'] / 60, 1),
                    'icon_url' => "http://media.steampowered.com/steamcommunity/public/images/apps/{$game['appid']}/{$game['img_icon_url']}.jpg"
                ];
            });

            $statusLabel = match($playerSummary['personastate'] ?? 0) { 0 => 'Offline', 1 => 'Online', 2 => 'Busy', 3 => 'Away', 4 => 'Snooze', default => 'Online', };
            $statusText = $statusLabel;
            if ($playerSummary['personastate'] == 0) $statusText = 'Offline (' . $lastLogoff . ')';
            if (isset($playerSummary['gameextrainfo'])) {
                $statusText = 'Playing: ' . $playerSummary['gameextrainfo'];
                $statusLabel = 'In-Game'; 
            }

            // --- RETURN DATA ---
            return [
                'result' => [
                    'profile' => [
                        'name' => $playerSummary['personaname'], 'avatar' => $playerSummary['avatarfull'],
                        'url' => $playerSummary['profileurl'], 'created_at' => $creationDate,
                        'country' => $playerSummary['loccountrycode'] ?? 'World',
                        'status_text' => $statusText, 'status_label' => $statusLabel,
                        'hero_image' => $heroImage, 'frame_url' => $frameUrl,
                    ],
                    'ids' => [ 'id64' => $steamId, 'id3' => $steamId3, 'id2' => $steamId2 ],
                    'level_info' => [ 'level' => $steamLevel, 'xp' => $playerXp, 'xp_needed' => $xpNeeded, 'total_badges' => $totalBadges ],
                    'friends_count' => $friendCount,
                    'bans' => [
                        'vac_banned' => $bansData['VACBanned'] ?? false,
                        'community_banned' => $bansData['CommunityBanned'] ?? false,
                        'economy_ban' => $bansData['EconomyBan'] ?? 'none',
                        'game_ban_count' => $bansData['NumberOfGameBans'] ?? 0,
                        'days_since_last_ban' => $bansData['DaysSinceLastBan'] ?? 0,
                    ],
                    'stats' => [
                        'total_games' => $totalGames, 'total_hours' => $totalPlaytimeHours, 'estimated_value' => $formattedValue,
                        'account_age' => $accountAge, 'never_played_count' => $neverPlayed, 'played_percentage' => $playedPercentage,
                        'avg_playtime' => $avgPlaytime, 'price_per_hour' => $formattedPPH, 'gamer_class' => $gamerClass, 'currency_code' => $currencyCode,
                    ],
                    'recent_games' => $recentGames,
                    'top_games' => $topGames,
                    'friends_list' => $friendsListDetailed,
                ]
            ];
        }); // End Cache

        // Handle Error jika data null (API Fail) atau string 'private'
        if ($data === null) return back()->withErrors(['steam_id' => 'Gagal mengambil data. API Steam sedang sibuk.']);
        if ($data === 'private') return back()->withErrors(['steam_id' => 'Profil ini Private. Tidak dapat discan.']);

        // Render
        return Inertia::render('SteamResult', $data);
    }

    private function resolveSteamId($input) {
        $input = trim($input);
        $cleanInput = basename(rtrim($input, '/'));
        if (is_numeric($cleanInput) && strlen($cleanInput) === 17) return $cleanInput;
        
        return Cache::remember("vanity_{$cleanInput}", 60 * 24, function () use ($cleanInput) {
            try {
                $response = Http::get("http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/", ['key' => $this->apiKey, 'vanityurl' => $cleanInput])->json();
                if (($response['response']['success'] ?? 0) == 1) return $response['response']['steamid'];
            } catch (\Exception $e) { return null; }
            return null;
        });
    }
}