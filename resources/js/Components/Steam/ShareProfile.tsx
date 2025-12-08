import React, { useRef, useState } from 'react';
import { domToPng, domToBlob } from 'modern-screenshot';
import { ResultData } from '@/Types/SteamTypes';
import { Button } from "@/Components/ui/button";
import { Share2, Download, Loader2, Trophy, Clock, Gamepad2, Wallet, Copy, Crown, Zap, ShieldCheck, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/Components/ui/dialog";
import { toast } from "sonner";

interface Props {
    result: ResultData;
}

export default function ShareProfile({ result }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isCopying, setIsCopying] = useState(false);

    // Proxy Helper
    const getProxyUrl = (url: string | null) => {
        if (!url) return '';
        return `/image-proxy?url=${encodeURIComponent(url)}`;
    };

    // Config modern-screenshot
    const screenshotConfig = {
        scale: 2, // Output Resolusi Tinggi (Retina)
        backgroundColor: '#09090b',
        features: { removeControlCharacter: true },
        fetch: { bypassingCache: true }
    };

    // Handle Download
    const handleDownload = async () => {
        if (ref.current === null) return;
        setIsDownloading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Delay sedikit lebih lama untuk load font
            const dataUrl = await domToPng(ref.current, screenshotConfig);
            const link = document.createElement('a');
            link.download = `SteamCalc-${result.profile.name}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Gambar Ultra HD berhasil disimpan!");
        } catch (err) {
            console.error(err);
            toast.error("Gagal menyimpan gambar.");
        } finally {
            setIsDownloading(false);
        }
    };

    // Handle Copy
    const handleCopyImage = async () => {
        if (ref.current === null) return;
        setIsCopying(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const blob = await domToBlob(ref.current, screenshotConfig);
            if (blob) {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                toast.success("Gambar Ultra HD disalin ke clipboard!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Gagal menyalin gambar.");
        } finally {
            setIsCopying(false);
        }
    };

    const rawBgImage = result.profile.hero_image 
        ? result.profile.hero_image 
        : 'https://community.cloudflare.steamstatic.com/public/shared/images/join_bg.jpg';
    const bgImage = `url('${getProxyUrl(rawBgImage)}')`;

    // Status Config (Updated for Pill Shape & Glow)
    const statusConfig = {
        'In-Game': { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', glow: 'shadow-[0_0_12px_rgba(74,222,128,0.25)]' },
        'Online': { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'shadow-[0_0_12px_rgba(96,165,250,0.25)]' },
        'Offline': { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', glow: '' },
    }[result.profile.status_label] || { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', glow: '' };

    // Texture Noise Halus
    const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.07'/%3E%3C/svg%3E")`;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-black/40 border-white/10 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 text-gray-400 rounded-full h-10 w-10 transition-all shadow-lg backdrop-blur-md group relative overflow-hidden"
                    title="Buat Kartu Premium"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <Share2 className="w-4 h-4 relative z-10" />
                </Button>
            </DialogTrigger>
            
            <DialogContent className="bg-[#0f1216] border-white/10 sm:max-w-fit w-full p-0 overflow-hidden shadow-2xl gap-0 font-sans">
                <div className="p-6 pb-2 text-center border-b border-white/5">
                    <DialogHeader>
                        <DialogTitle className="text-white text-xl flex items-center justify-center gap-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>
                            <Sparkles className="w-5 h-5 text-indigo-400" /> Premium Share Card
                        </DialogTitle>
                        <DialogDescription className="text-xs text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Kartu statistik Ultra HD untuk dipamerkan.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex flex-col items-center w-full bg-[#0c0e11]">
                    
                    {/* WRAPPER SCROLLABLE */}
                    <div className="w-full overflow-x-auto p-6 md:p-8 flex justify-center relative">
                        
                        {/* --- KARTU TARGET (FIXED 600x380) --- */}
                        {/* Height ditingkatkan sedikit agar lebih lega */}
                        <div className="relative shadow-[0_0_60px_rgba(0,0,0,0.7)] rounded-2xl shrink-0 group select-none overflow-hidden ring-1 ring-white/10">
                            <div 
                                ref={ref} 
                                className="w-[600px] h-[380px] min-w-[600px] relative flex flex-col text-white overflow-hidden rounded-2xl bg-[#09090b]"
                            >
                                {/* Inject Fonts Explicitly for Renderer */}
                                <style>
                                    {`
                                        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
                                        .font-manrope { font-family: 'Manrope', sans-serif; }
                                        .font-inter { font-family: 'Inter', sans-serif; }
                                    `}
                                </style>

                                {/* LAYER 1: Hero Image BG */}
                                <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-105" style={{ backgroundImage: bgImage }}></div>
                                
                                {/* LAYER 2: Gradient Overlay */}
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0.80) 0%, rgba(9,9,11,0.98) 90%)' }}></div>
                                
                                {/* LAYER 3: Glow Accent (Top Right) */}
                                <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-600/15 blur-[100px] rounded-full mix-blend-screen"></div>

                                {/* --- CONTENT LAYER --- */}
                                <div className="relative z-20 h-full flex flex-col justify-between p-8">
                                    
                                    {/* HEADER SECTION: Identity & Value Hierarchy */}
                                    <div className="flex justify-between items-start">
                                        {/* Left: Avatar & Profile Info */}
                                        <div className="flex items-center gap-5">
                                            {/* Avatar Box with Glow */}
                                            <div className="relative group/avatar">
                                                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-white/10 to-transparent blur-sm opacity-50"></div>
                                                <img 
                                                    src={getProxyUrl(result.profile.avatar)} 
                                                    className="w-20 h-20 rounded-2xl border-2 border-white/10 shadow-2xl bg-[#09090b] object-cover relative z-10"
                                                    crossOrigin="anonymous"
                                                    alt="Avatar"
                                                />
                                                {/* Status Indicator */}
                                                <div className={`absolute -bottom-1.5 -right-1.5 z-20 w-5 h-5 rounded-full border-[3px] border-[#09090b] ${statusConfig.bg.replace('/10', '')} shadow-sm`}></div>
                                            </div>

                                            <div className="flex flex-col justify-center gap-1.5">
                                                <h2 className="text-[1.75rem] leading-none font-extrabold tracking-tight text-white truncate max-w-[280px] drop-shadow-lg font-manrope">
                                                    {result.profile.name}
                                                </h2>
                                                
                                                {/* Badges Row */}
                                                <div className="flex items-center gap-2 font-inter">
                                                    {/* Country */}
                                                    {result.profile.country !== 'World' && (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
                                                            <img src={getProxyUrl(`https://flagsapi.com/${result.profile.country}/flat/24.png`)} className="w-3 opacity-80" alt="Flag" crossOrigin="anonymous" />
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{result.profile.country}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Age */}
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
                                                        <Clock className="w-3 h-3 text-gray-500" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{result.stats.account_age}</span>
                                                    </div>

                                                    {/* Rank (Dipindah ke sini jika ingin dekat nama, tapi permintaan adalah value di kanan) */}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Rank & Account Value */}
                                        <div className="flex flex-col items-end gap-1">
                                            {/* Rank Badge */}
                                            <div className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-extrabold text-[#fbbf24] border border-[#fbbf24]/30 bg-[#fbbf24]/10 shadow-[0_0_15px_rgba(251,191,36,0.1)] backdrop-blur-md flex items-center gap-1.5 font-manrope mb-1`}>
                                                <ShieldCheck className="w-3 h-3" />
                                                {result.stats.gamer_class}
                                            </div>
                                            
                                            {/* Account Value (Hero Metric) */}
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5 font-inter">Account Value</p>
                                                <p className="text-[1.8rem] font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] leading-none font-manrope">
                                                    {result.stats.estimated_value}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MIDDLE: METRICS GRID (3 Cols) */}
                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <StatBlockPremium 
                                            label="STEAM LEVEL" 
                                            value={result.level_info.level} 
                                            color="#60a5fa" 
                                            icon={Trophy} 
                                            glow="rgba(96, 165, 250, 0.1)"
                                        />
                                        <StatBlockPremium 
                                            label="TOTAL PLAYTIME" 
                                            value={result.stats.total_hours + 'h'} 
                                            color="#ffffff" 
                                            icon={Clock} 
                                            glow="rgba(255, 255, 255, 0.05)"
                                        />
                                        <StatBlockPremium 
                                            label="GAMES OWNED" 
                                            value={result.stats.total_games} 
                                            color="#a855f7" 
                                            icon={Gamepad2} 
                                            glow="rgba(168, 85, 247, 0.1)"
                                        />
                                    </div>

                                    {/* FOOTER: Top Games & Branding */}
                                    <div className="flex justify-between items-end border-t border-white/10 pt-5 mt-auto">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5 font-inter">
                                                <Trophy className="w-3 h-3 text-gray-600" />
                                                TOP GAMES
                                            </p>
                                            <div className="flex gap-3">
                                                {result.top_games.slice(0, 3).map((g, i) => (
                                                    <div key={i} className="relative group/icon">
                                                        <div className="absolute inset-0 bg-white/5 rounded-lg transform rotate-3 scale-90 opacity-0 group-hover/icon:opacity-100 transition-opacity"></div>
                                                        <img 
                                                            src={getProxyUrl(g.icon_url)} 
                                                            className="w-[2.5rem] h-[2.5rem] rounded-lg border border-white/10 shadow-lg bg-[#09090b] object-cover relative z-10" 
                                                            alt={g.name}
                                                            crossOrigin="anonymous"
                                                        />
                                                        {i === 0 && (
                                                            <div className="absolute -top-2 -right-2 z-20 filter drop-shadow-md">
                                                                <Crown className="w-4 h-4 fill-[#facc15] text-[#facc15]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className="flex items-center gap-1.5 justify-end mb-1 opacity-60">
                                                <Zap className="w-3 h-3 text-indigo-400" />
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest font-inter">VERIFIED STATS</p>
                                            </div>
                                            <p className="text-xl font-extrabold text-white tracking-wide leading-none flex items-center justify-end font-manrope">
                                                SteamCalc<span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #60a5fa, #a855f7)' }}>.Neo</span>
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* BUTTON ACTIONS */}
                    <div className="w-full max-w-lg px-6 pb-6 grid grid-cols-2 gap-3">
                        <Button 
                            onClick={handleCopyImage} 
                            disabled={isCopying || isDownloading}
                            variant="secondary"
                            className="w-full bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white border border-white/10 font-bold h-12 backdrop-blur-md transition-all rounded-xl font-manrope"
                        >
                            {isCopying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
                            Salin (Clipboard)
                        </Button>

                        <Button 
                            onClick={handleDownload} 
                            disabled={isCopying || isDownloading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold h-12 shadow-lg shadow-indigo-500/25 transition-all rounded-xl font-manrope"
                        >
                            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                            Simpan (PNG HD)
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper StatBlock Premium (Refined with Fonts)
function StatBlockPremium({ label, value, color, icon: Icon, glow }: any) {
    return (
        <div 
            style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1rem', // Lebih rounded
                boxShadow: `inset 0 0 40px ${glow}`
            }} 
            className="p-4 flex flex-col justify-center relative overflow-hidden h-[100px]"
        >
            {/* Watermark Icon */}
            <Icon 
                className="absolute -bottom-4 -right-4 w-16 h-16 opacity-[0.06] transform -rotate-12" 
                style={{ color: color }} 
            />
            
            <div className="flex items-center gap-1.5 mb-2 opacity-80 relative z-10">
                <Icon className="w-3.5 h-3.5" style={{ color: color }} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 font-inter">{label}</span>
            </div>
            <p 
                className="text-[1.75rem] font-extrabold truncate tracking-tight leading-none relative z-10 drop-shadow-sm font-manrope"
                style={{ color: color }}
            >
                {value}
            </p>
        </div>
    );
}