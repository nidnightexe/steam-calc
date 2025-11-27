import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ResultData } from '@/Types/SteamTypes';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Progress } from "@/Components/ui/progress";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    Gamepad2, Clock, Coins, Users, Trophy, History, Library, Ghost, PlayCircle, Wallet, ExternalLink, ChevronLeft, ChevronRight, ArrowRight, Award, Medal, Info, Crown, Zap, Wifi, Moon
} from "lucide-react";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/Components/ui/select"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card"
interface Props {
    result: ResultData;
    onCurrencyChange: (value: string) => void;
}

export default function StatsContent({ result, onCurrencyChange }: Props) {
    const playedPercent = result.stats.played_percentage;

    // Pagination State untuk Friends
    const [currentPage, setCurrentPage] = useState(1);

    // Responsive Items Per Page
    const [itemsPerPage, setItemsPerPage] = useState(8); // default mobile = 8

    useEffect(() => {
        const updateItems = () => {
            if (window.innerWidth < 1024) {
                setItemsPerPage(4);  // mobile & tablet
            } else {
                setItemsPerPage(6); // desktop / large screen
            }
        };

        updateItems(); // running saat pertama load
        window.addEventListener("resize", updateItems);

        return () => window.removeEventListener("resize", updateItems);
    }, []);

    const totalFriends = result.friends_list ? result.friends_list.length : 0;
    const totalPages = Math.ceil(totalFriends / itemsPerPage);

    const currentFriends = result.friends_list
        ? result.friends_list.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
        : [];

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(curr => curr - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(curr => curr + 1);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* SECTION 1: MAIN STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCardPremium title="Total Game" value={result.stats.total_games} subtext="Titles in Library" icon={Gamepad2} colorClass="text-blue-400" bgClass="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20" glowClass="from-blue-500/20" />
                <StatCardPremium title="Total Playtime" value={result.stats.total_hours} suffix="h" subtext="Hours Played" icon={Clock} colorClass="text-emerald-400" bgClass="bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20" glowClass="from-emerald-500/20" />
                <StatCardPremium title="Cost / Hour" value={result.stats.price_per_hour} subtext="Value per Hour" icon={Wallet} colorClass="text-purple-400" bgClass="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20" glowClass="from-purple-500/20" valueSize="text-xl lg:text-2xl" />
                <StatCardPremium title="Steam Friends" value={result.friends_count} subtext="Social Connections" icon={Users} colorClass="text-pink-400" bgClass="bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20" glowClass="from-pink-500/20" />
            </div>

            {/* SECTION 2: VALUATION & LIBRARY HEALTH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Valuation Card */}
                <Card className="relative overflow-hidden border-none bg-gradient-to-br from-yellow-500/10 to-orange-600/10 backdrop-blur-md shadow-xl group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Coins className="absolute -right-6 -bottom-6 w-32 h-32 text-yellow-500/10 rotate-12" />
                    <CardContent className="p-6 flex flex-col justify-evenly h-full relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 text-yellow-500">
                                <div className="p-1.5 bg-yellow-500/20 rounded-md">
                                    <Coins className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">Average Price</span>
                            </div>
                            <Select value={result.stats.currency_code} onValueChange={onCurrencyChange}>
                                <SelectTrigger className="h-7 w-auto gap-1 px-2 border-white/10 bg-black/20 text-yellow-200 hover:text-yellow-100 hover:bg-black/40 text-xs rounded-lg focus:ring-0 [&>svg]:hidden font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1d24] border-white/10 text-white">
                                    <SelectItem value="IDR">IDR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="JPY">JPY</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-sm tracking-tight">
                                {result.stats.estimated_value}
                            </div>
                            <p className="text-[10px] text-yellow-500/30 font-medium uppercase tracking-wide">
                                *Based on the average price per game
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Library Health Card */}
                <Card className="bg-[#171a21]/80 border-white/10 backdrop-blur-md shadow-lg flex flex-col justify-center relative overflow-hidden">
                    <CardHeader className="pb-2 relative z-10">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <Library className="w-4 h-4 text-purple-400" />
                                Library Health
                            </CardTitle>
                            <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                {result.stats.played_percentage}% Played
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5 relative z-10">
                        <div className="h-4 w-full flex rounded-lg overflow-hidden bg-gray-800/50 border border-white/5">
                            <div style={{ width: `${playedPercent}%` }} className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full shadow-[0_0_15px_rgba(168,85,247,0.4)] relative group">
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex-1 bg-gray-700/30 h-full relative">
                                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#fff_5px,#fff_10px)]"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/20 rounded-xl p-3 flex items-center gap-3 border border-white/5 hover:border-blue-500/30 transition-colors group">
                                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                    <PlayCircle className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Games Played</p>
                                    <p className="text-lg font-bold text-white">{result.stats.total_games - result.stats.never_played_count}</p>
                                </div>
                            </div>
                            <div className="bg-black/20 rounded-xl p-3 flex items-center gap-3 border border-white/5 hover:border-red-500/30 transition-colors group">
                                <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                                    <Ghost className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Pile of Shame</p>
                                    <p className="text-lg font-bold text-white">{result.stats.never_played_count}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SECTION 3: RECENT & TOP GAMES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-[#171a21]/60 border-white/10 backdrop-blur-md lg:col-span-1 h-full flex flex-col gap-0">
                    <CardHeader className="pb-5 border-b border-white/5 px-6">
                        <CardTitle className="text-sm font-bold text-gray-200 flex items-center gap-2">
                            <History className="w-4 h-4 text-green-400" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 px-4 space-y-2 flex-1">
                        {result.recent_games.length > 0 ? (
                            result.recent_games.map((game, idx) => (
                                <div key={idx} className="flex items-center gap-3 group p-3 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5">
                                    <Avatar className="h-11 w-11 rounded-lg border border-white/10 group-hover:border-green-500/30 transition-colors shadow-sm">
                                        <AvatarImage src={game.icon_url} />
                                        <AvatarFallback className="rounded-lg"></AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-gray-200 truncate group-hover:text-green-400 transition-colors">{game.name}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">{game.playtime_2weeks} Hours <span className="text-gray-600">/ 2 week</span></p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-xs italic py-8">
                                No activity in the last two weeks.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-[#171a21]/60 border-white/10 backdrop-blur-md lg:col-span-2 gap-0">
                    <CardHeader className="pb-5 border-b border-white/5 px-6">
                        <CardTitle className="text-sm font-bold text-gray-200 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            Most Played Games
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                        <TooltipProvider>
                            {result.top_games.map((game, idx) => {
                                const isTop = idx === 0;
                                const rankColor = idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-600';

                                const GameCardContent = (
                                    <div className={`relative flex items-center gap-4 p-3 rounded-xl transition-all group overflow-hidden border ${isTop ? 'bg-gradient-to-r from-yellow-500/5 to-transparent border-yellow-500/20' : 'hover:bg-white/5 border-transparent hover:border-white/5'}`}>
                                        <div className="flex-shrink-0 w-6 text-center">
                                            <span className={`text-base font-black ${rankColor}`}>#{idx + 1}</span>
                                        </div>
                                        <Avatar className="h-12 w-12 rounded-lg shadow-lg border border-white/5 group-hover:scale-105 transition-transform duration-300">
                                            <AvatarImage src={game.icon_url} />
                                            <AvatarFallback>G</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                            <div className="flex justify-between items-center">
                                                <p className={`font-bold text-sm truncate transition-colors ${isTop ? 'text-yellow-100' : 'text-gray-200 group-hover:text-white'}`}>
                                                    {game.name}
                                                </p>
                                                <p className="text-xs font-black text-gray-400 group-hover:text-white transition-colors">
                                                    {game.playtime_hours}h
                                                </p>
                                            </div>
                                            {game.achievement ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1.5 flex-1 bg-black/40 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${isTop ? 'bg-yellow-500' : 'bg-blue-500/70'}`}
                                                            style={{ width: `${game.achievement.percentage}%` }}
                                                        />
                                                    </div>
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger asChild>
                                                            <div className="cursor-help flex items-center gap-1 hover:scale-110 transition-transform">
                                                                <span className={`text-[10px] font-bold min-w-[30px] text-right ${isTop ? 'text-yellow-500' : 'text-gray-400'}`}>
                                                                    {game.achievement.percentage}%
                                                                </span>
                                                                <Info className="w-2.5 h-2.5 text-gray-600" />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" align="end" className="bg-[#1a1d24] border-white/10 text-gray-200 max-w-[280px] z-[60] p-3 shadow-2xl">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                                                    <p className="text-xs font-bold text-white flex items-center gap-2">
                                                                        <Award className="w-4 h-4 text-yellow-500" />
                                                                        Achievements
                                                                    </p>
                                                                    <Badge variant="secondary" className="text-[10px] bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">
                                                                        {game.achievement.unlocked} / {game.achievement.total}
                                                                    </Badge>
                                                                </div>
                                                                {game.achievement.samples && game.achievement.samples.length > 0 ? (
                                                                    <div className="space-y-2">
                                                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Terbuka Baru-baru Ini:</p>
                                                                        <div className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                                                            {game.achievement.samples.map((ach, i) => (
                                                                                <div key={i} className="flex items-center gap-2 bg-black/30 p-1.5 rounded-md border border-white/5">
                                                                                    <div className="p-1 bg-yellow-500/10 rounded-full shrink-0">
                                                                                        {i === 0 ? <Trophy className="w-3 h-3 text-yellow-400" /> : <Medal className="w-3 h-3 text-gray-500" />}
                                                                                    </div>
                                                                                    <span className="text-[10px] text-gray-300 truncate font-medium w-full">
                                                                                        {ach.replace(/_/g, ' ')}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-[10px] text-gray-500 italic">Tidak ada detail.</p>
                                                                )}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <div className="h-1.5 w-full bg-gray-800/30 rounded-full" />
                                            )}
                                        </div>
                                    </div>
                                );
                                return <div key={idx}>{GameCardContent}</div>;
                            })}
                        </TooltipProvider>
                    </CardContent>
                </Card>
            </div>

            {/* SECTION 4: FRIENDS LIST (PAGINATED + INTERACTIVE) */}
            {result.friends_list && result.friends_list.length > 0 && (
                <Card className="bg-[#171a21]/60 border-white/10 backdrop-blur-md gap-0 p-0">
                    <CardHeader className="pb-4 border-b border-white/5 px-6 pt-5">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-bold text-gray-200 flex items-center gap-2">
                                <Users className="w-4 h-4 text-pink-400" />
                                Friend ({result.friends_count})
                            </CardTitle>

                            {totalPages > 1 && (
                                <div className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-30 text-gray-400 hover:text-white" onClick={goToPrevPage} disabled={currentPage === 1}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-[10px] text-gray-500 font-mono w-12 text-center border-x border-white/5 mx-1">
                                        {currentPage}/{totalPages}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-30 text-gray-400 hover:text-white" onClick={goToNextPage} disabled={currentPage === totalPages}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {currentFriends.map((friend) => {
                                const ringColor = friend.status_label === 'In-Game' ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' :
                                    friend.status_label === 'Online' ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' :
                                        'border-gray-700/50';

                                const statusTextClass = friend.status_label === 'In-Game' ? 'text-green-400' :
                                    friend.status_label === 'Online' ? 'text-blue-400' :
                                        'text-gray-500';

                                const statusIcon = friend.status_label === 'In-Game' ? <Gamepad2 className="w-3 h-3" /> :
                                    friend.status_label === 'Online' ? <Wifi className="w-3 h-3" /> :
                                        <Moon className="w-3 h-3" />;

                                return (
                                    <HoverCard key={friend.steamid} openDelay={150} closeDelay={0}>
                                        <HoverCardTrigger asChild>
                                            <Link
                                                href={`/profile/${friend.steamid}?currency=${result.stats.currency_code}`}
                                                className="group relative flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                <div className={`relative mb-3 rounded-full p-0.5 border-2 ${ringColor} transition-colors bg-[#09090b]`}>
                                                    <Avatar className="h-14 w-14 rounded-full">
                                                        <AvatarImage src={friend.avatar} />
                                                        <AvatarFallback>{friend.personaname.substring(0, 1)}</AvatarFallback>
                                                    </Avatar>
                                                </div>

                                                <div className="w-full text-center space-y-0.5">
                                                    <p className="text-xs font-bold text-gray-300 truncate w-full group-hover:text-white transition-colors">
                                                        {friend.personaname}
                                                    </p>
                                                    <p className={`text-[9px] font-medium truncate uppercase tracking-wide ${statusTextClass}`}>
                                                        {friend.status_label}
                                                    </p>
                                                </div>
                                            </Link>
                                        </HoverCardTrigger>

                                        {/* [UPDATE] HoverCard Content - Menambahkan sideOffset={10} dan collisionPadding={16} */}
                                        <HoverCardContent
                                            className="w-72 bg-[#1a1d24]/95 backdrop-blur-xl border-white/10 p-0 shadow-2xl rounded-xl z-[100] overflow-hidden"
                                            sideOffset={10}
                                            collisionPadding={16}
                                        >
                                            <div className="p-4 bg-gradient-to-b from-white/5 to-transparent">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className={`h-14 w-14 rounded-full border-2 ${ringColor.split(' ')[0]} shadow-lg`}>
                                                        <AvatarImage src={friend.avatar} />
                                                        <AvatarFallback>{friend.personaname.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-sm font-bold text-white truncate">{friend.personaname}</h4>
                                                        <Badge variant="outline" className={`mt-1 text-[10px] border-0 px-1.5 py-0 bg-white/5 ${statusTextClass} flex items-center gap-1 w-fit`}>
                                                            {statusIcon}
                                                            {friend.status_label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-black/20 border-t border-white/5 grid grid-cols-2 gap-2">
                                                <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 shadow-md font-bold">
                                                    <a href={`steam://openurl/${friend.profileurl}`}>Chat / App</a>
                                                </Button>
                                                <Button asChild size="sm" variant="outline" className="w-full bg-transparent border-white/10 hover:bg-white/5 text-gray-400 text-xs h-8">
                                                    <a href={friend.profileurl} target="_blank" rel="noreferrer"><ExternalLink className="w-3 h-3 mr-2" /> Profil</a>
                                                </Button>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}

function StatCardPremium({ title, value, subtext, icon: Icon, suffix, colorClass, bgClass, glowClass, valueSize = "text-3xl" }: any) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 group ${bgClass} backdrop-blur-md`}>
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${glowClass} to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
            <Icon className={`absolute -bottom-4 -right-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-all transform group-hover:scale-110 group-hover:-rotate-12 ${colorClass}`} />
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-md bg-black/20 backdrop-blur-sm ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">{title}</span>
                </div>
                <div>
                    <div className={`font-black text-white tracking-tight flex items-baseline gap-1 ${valueSize}`}>
                        {value}
                        {suffix && <span className="text-lg text-gray-500 font-medium">{suffix}</span>}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">{subtext}</p>
                </div>
            </div>
        </div>
    );
}