import { Link, router } from '@inertiajs/react';
import { ResultData } from '@/Types/SteamTypes';
import ProfileSidebar from '@/Components/Steam/ProfileSidebar';
import StatsContent from '@/Components/Steam/StatsContent';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Toaster } from "@/Components/ui/sonner";
import { ChevronLeft, ShieldCheck } from "lucide-react";

interface Props {
    result: ResultData;
}

export default function SteamResult({ result }: Props) {
    if (!result) return null;

    const bgImage = result.profile.hero_image
        ? `url('${result.profile.hero_image}')`
        : `url('https://community.cloudflare.steamstatic.com/public/shared/images/join_bg.jpg')`;

    const handleCurrencyChange = (value: string) => {
        router.get(
            `/profile/${result.ids.id64}`,
            { currency: value },
            { preserveScroll: true, preserveState: true }
        );
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-gray-100 font-sans relative selection:bg-blue-500/30 selection:text-blue-200">

            {/* Dynamic Background */}
            <div className="fixed inset-0 w-full h-full -z-50">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105 blur-sm opacity-40"
                    style={{ backgroundImage: bgImage }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-[#09090b]/60" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 pb-0">

                {/* HEADER NAVIGATION */}
                <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 top-4 z-50">

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Back Button */}
                        <Button
                            variant="ghost"
                            className="group bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white border border-white/10 backdrop-blur-md rounded-full px-5 h-12 transition-all hover:w-auto"
                            asChild
                        >
                            <Link href="/" className="flex items-center gap-2">
                                <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-blue-500 transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </div>
                                <span className="font-medium">Back to Search</span>
                            </Link>
                        </Button>
                    </div>

                    {/* Rank Badge */}
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-12 px-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 text-yellow-400 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                            <ShieldCheck className="w-5 h-5 mr-2" />
                            <span className="text-base font-bold tracking-wide">{result.stats.gamer_class}</span>
                        </Badge>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Sidebar (Now scrolls normally with the page) */}
                    <div className="lg:col-span-4 transition-all duration-500 animate-in slide-in-from-left-4 fade-in">
                        <ProfileSidebar result={result} />
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-8 transition-all duration-500 delay-100 animate-in slide-in-from-bottom-4 fade-in">
                        <StatsContent result={result} onCurrencyChange={handleCurrencyChange} />
                    </div>
                </main>

                <footer className="mt-16 pt-8 border-t border-white/5 text-center pb-8">
                    <p className="text-gray-500 text-sm font-medium">
                        SteamCalc Indonesia &copy; {new Date().getFullYear()}.
                        <span className="block sm:inline sm:ml-1 text-gray-600">Data provided by Valve Corp.</span>
                    </p>
                </footer>
            </div>

            {/* Global Toaster styling */}
            <Toaster
                position="top-center"
                theme="dark"
                toastOptions={{
                    style: {
                        background: '#18181b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        borderRadius: '12px',
                    },
                    classNames: {
                        toast: 'bg-[#18181b] border-white/10 shadow-xl',
                        title: 'text-white font-bold',
                        description: 'text-gray-400',
                        actionButton: 'bg-white text-black',
                        cancelButton: 'bg-white/10 text-white',
                    }
                }}
            />
        </div>
    );
}
