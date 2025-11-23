import { useState } from 'react';
import { ResultData } from '@/wayfinder/SteamTypes';
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { toast } from "sonner";
import {
    ShieldCheck, ShieldAlert, Globe, Copy, ExternalLink, Award, Hash, CheckCircle2, XCircle, AlertTriangle, History
} from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card"

interface Props {
    result: ResultData;
}

export default function ProfileSidebar({ result }: Props) {
    const isVacClean = !result.bans.vac_banned;
    const isGameClean = result.bans.game_ban_count === 0;
    const isCommunityClean = !result.bans.community_banned;
    const isEconomyClean = result.bans.economy_ban === 'none';
    const isFullyClean = isVacClean && isGameClean && isCommunityClean && isEconomyClean;

    const isOnline = result.profile.status_label === 'Online';
    const isInGame = result.profile.status_label === 'In-Game';
    const hasFrame = result.profile.frame_url !== null;

    const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

    let statusColor = "text-gray-400";
    let statusBg = "bg-gray-500";
    let statusBorder = "border-gray-600";

    if (isOnline) {
        statusColor = "text-blue-400";
        statusBg = "bg-blue-500";
        statusBorder = "border-blue-500";
    } else if (isInGame) {
        statusColor = "text-green-400";
        statusBg = "bg-green-500";
        statusBorder = "border-green-500";
    }

    if (hasFrame) {
        statusBorder = "border-transparent";
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedLabel(label);
        setTimeout(() => setCopiedLabel(null), 2000);
        toast.success(`${label} copied successfully!`, {
            description: text,
            style: { background: "#1a1d24", border: "1px solid rgba(255,255,255,0.1)", color: "white" }
        });
    };

    return (
        <div className="space-y-6 relative">

            {/* PROFILE CARD */}
            <Card className="bg-[#171a21]/80 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden group p-0">
                <div className={`h-24 w-full bg-gradient-to-b ${
                    isInGame ? 'from-green-900/40 to-[#171a21]/0' :
                    isOnline ? 'from-blue-900/40 to-[#171a21]/0' :
                    'from-gray-800/40 to-[#171a21]/0'
                }`} />

                <div className="px-6 pb-6 -mt-12 flex flex-col items-center relative z-10">

                    {/* AVATAR */}
                    <div className="relative mb-4">
                        <div className="relative group cursor-pointer">
                            <Avatar className={`w-36 h-36 bg-gray-900 rounded-xl shadow-2xl border-[3px] ${statusBorder}`}>
                                <AvatarImage src={result.profile.avatar} alt={result.profile.name} className="rounded-xl" />
                                <AvatarFallback className="rounded-xl text-2xl font-bold bg-gray-800 text-gray-400">
                                    {result.profile.name.substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Avatar Frame */}
                            {result.profile.frame_url && (
                                <img
                                    src={result.profile.frame_url}
                                    alt="Frame"
                                    className="absolute w-[176px] h-[176px] pointer-events-none z-20"
                                    style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.22)' }}
                                />
                            )}
                        </div>

                        {/* Level Badge */}
                        <div className="absolute -bottom-3 -right-3 z-30">
                            <div className="relative flex items-center justify-center w-12 h-12">
                                <span className="absolute inset-0 rounded-full border-[3px] border-[#171a21] bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg"></span>
                                <span className="relative text-white font-bold text-sm">{result.level_info.level}</span>
                            </div>
                        </div>
                    </div>

                    {/* NAME + STATUS */}
                    <div className="text-center space-y-1 mb-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">{result.profile.name}</h2>
                        <div className="flex items-center justify-center gap-2">
                            <span className={`relative flex h-2 w-2`}>
                                {(isOnline || isInGame) && (
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusBg}`}></span>
                                )}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${statusBg}`}></span>
                            </span>
                            <p className={`text-sm font-medium ${statusColor}`}>{result.profile.status_text}</p>
                        </div>
                    </div>

                    {/* COUNTRY + ACCOUNT AGE */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6 w-full">
                        <Badge variant="outline" className="bg-black/20 border-white/10 text-gray-300 px-3 py-1.5 gap-2 backdrop-blur-sm">
                            {result.profile.country === 'World'
                                ? <Globe className="w-3.5 h-3.5" />
                                : <img src={`https://flagsapi.com/${result.profile.country}/flat/24.png`} className="w-4 opacity-80" alt="Flag" />}
                            <span className="text-xs">{result.profile.country}</span>
                        </Badge>
                        <Badge variant="outline" className="bg-black/20 border-white/10 text-gray-300 px-3 py-1.5 text-xs">
                            {result.stats.account_age}
                        </Badge>
                    </div>

                    {/* REPUTATION STATUS */}
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <div className={`w-full flex items-center justify-between p-3 rounded-xl border mb-6 transition-all cursor-pointer hover:bg-opacity-20 ${
                                isFullyClean
                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                                    : 'bg-red-500/5 border-red-500/20 text-red-400 hover:bg-red-500/10'
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isFullyClean ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                        {isFullyClean ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs font-bold uppercase tracking-wide">
                                            {isFullyClean ? 'Reputation' : 'Warning'}
                                        </span>
                                        <span className="text-sm font-semibold">
                                            {isFullyClean
                                                ? 'Good Standing'
                                                : `${result.bans.game_ban_count + (result.bans.vac_banned ? 1 : 0)} Recorded Bans`
                                            }
                                        </span>
                                    </div>
                                </div>
                                {isFullyClean ? <CheckCircle2 className="w-5 h-5 opacity-50" /> : <AlertTriangle className="w-5 h-5 opacity-50" />}
                            </div>
                        </HoverCardTrigger>

                        <HoverCardContent className="w-80 bg-[#1a1d24] border-white/10 shadow-2xl text-gray-200 p-4 backdrop-blur-xl z-[100]">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <h4 className="text-sm font-bold text-white">Security Details</h4>
                                    <span className="text-[10px] text-gray-500">Valve Anti-Cheat</span>
                                </div>

                                <div className="space-y-3">
                                    <StatusItem label="VAC Status" isClean={isVacClean} />
                                    <StatusItem label="Game Ban" isClean={isGameClean} text={!isGameClean ? `${result.bans.game_ban_count} Bans` : undefined} />
                                    <StatusItem label="Community Ban" isClean={isCommunityClean} />
                                    <StatusItem label="Trade Ban" isClean={isEconomyClean} text={!isEconomyClean ? result.bans.economy_ban : undefined} />
                                </div>

                                {!isFullyClean && (
                                    <div className="pt-2 border-t border-white/5">
                                        <p className="text-xs text-red-400 flex items-center gap-2">
                                            <History className="w-3 h-3" />
                                            Last ban: {result.bans.days_since_last_ban} days ago
                                        </p>
                                    </div>
                                )}
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                    {/* BUTTONS */}
                    <div className="grid grid-cols-5 gap-2 w-full">
                        <Button asChild className="col-span-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-0 shadow-lg shadow-blue-900/20 transition-all h-11">
                            <a href={`steam://openurl/${result.profile.url}`}>
                                Open in App
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="col-span-1 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-gray-400 h-11 px-0">
                            <a href={result.profile.url} target="_blank" rel="noreferrer" title="Open in Browser">
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </Button>
                    </div>
                </div>
            </Card>

            {/* LEVEL CARD */}
            <Card className="bg-[#171a21]/80 border-white/10 backdrop-blur-xl shadow-lg relative overflow-hidden p-0">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Award className="w-24 h-24 text-white transform rotate-12" />
                </div>
                <CardContent className="p-6 space-y-4 relative z-10">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Steam Level</p>
                            <div className="text-3xl font-black text-white">{result.level_info.level}</div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Total XP</p>
                            <div className="text-lg font-bold text-blue-400">
                                {result.level_info.xp.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* XP Progress */}
                    <div className="space-y-2">
                        <Progress value={45} className="h-1.5 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500" />
                        <div className="flex justify-between text-[10px] font-medium text-gray-500">
                            <span>Current</span>
                            <span>Next Level: {result.level_info.xp_needed} XP</span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span>
                            Owns <span className="text-white font-bold">{result.level_info.total_badges}</span> Badges
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* TECHNICAL IDS */}
            <Card className="bg-[#171a21]/80 border-white/10 backdrop-blur-xl shadow-lg p-0 gap-0">
                <CardHeader className="pt-5 pb-4 border-b border-white/5">
                    <h3 className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Technical IDs
                    </h3>
                </CardHeader>
                <CardContent className="p-2">
                    {[
                        { label: 'SteamID64', val: result.ids.id64 },
                        { label: 'SteamID3', val: result.ids.id3 },
                        { label: 'SteamID2', val: result.ids.id2 }
                    ].map((id, idx) => (
                        <div
                            key={idx}
                            onClick={() => copyToClipboard(id.val, id.label)}
                            className="group flex justify-between items-center p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
                        >
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{id.label}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-mono transition-all duration-300 ${
                                    copiedLabel === id.label
                                        ? 'text-green-400 font-bold'
                                        : 'text-gray-300 group-hover:text-white'
                                }`}>
                                    {copiedLabel === id.label ? 'Copied!' : id.val}
                                </span>
                                <Copy className={`w-3 h-3 transition-opacity ${
                                    copiedLabel === id.label ? 'opacity-0' : 'opacity-0 group-hover:opacity-50 text-gray-400'
                                }`} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

function StatusItem({ label, isClean, text }: { label: string, isClean: boolean, text?: string }) {
    return (
        <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`font-bold ${isClean ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isClean ? 'Clean' : (text || 'Banned')}
                </span>
                {isClean
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    : <XCircle className="w-3.5 h-3.5 text-red-500" />}
            </div>
        </div>
    );
}
