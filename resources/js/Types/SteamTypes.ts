export interface Game {
    name: string;
    playtime_hours: number;
    icon_url: string;
    appid?: number;
    achievement?: {
        total: number;
        unlocked: number;
        percentage: number;
        samples: string[];
    } | null;
}

export interface RecentGame {
    name: string;
    playtime_2weeks: number;
    icon_url: string;
}

export interface Friend {
    steamid: string;
    personaname: string;
    avatar: string;
    profileurl: string;
    personastate: number;
    status_label: 'Online' | 'Offline' | 'In-Game' | 'Busy';
}

export interface ResultData {
    profile: {
        name: string;
        avatar: string;
        url: string;
        created_at: string;
        country: string;
        status_text: string;
        status_label: string;
        hero_image: string | null;
        frame_url: string | null;
    };
    ids: {
        id64: string;
        id3: string;
        id2: string;
    };
    level_info: {
        level: number;
        xp: number;
        xp_needed: number;
        total_badges: number;
    };
    friends_count: number;
    // [FIX] Update bagian ini:
    bans: {
        vac_banned: boolean;
        community_banned: boolean; // Wajib ada
        economy_ban: string;       // Wajib ada
        game_ban_count: number;
        days_since_last_ban: number;
    };
    stats: {
        total_games: number;
        total_hours: number;
        estimated_value: string;
        account_age: string;
        never_played_count: number;
        played_percentage: number;
        avg_playtime: number;
        price_per_hour: string;
        gamer_class: string;
        currency_code: string;
    };
    recent_games: RecentGame[];
    top_games: Game[];
    friends_list: Friend[];
}