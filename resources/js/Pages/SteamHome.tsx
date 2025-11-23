import React, { useState, useEffect, useRef } from "react";
import { useForm, Link } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Gamepad2,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Activity,
  CheckCircle2,
  Wallet,
  AlertCircle,
  X,
  History,
  CalendarDays,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";

interface Props {
  errors: any;
}

export default function SteamHome({ errors }: Props) {
  const { data, setData, post, processing } = useForm({
    steam_id: "",
    currency: "IDR",
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("steamcalc_history");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }

    const handleClickOutside = (event: MouseEvent) => {
      const isDialog = (event.target as HTMLElement).closest("[role='dialog']");
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !isDialog
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveToHistory = (id: string) => {
    if (!id.trim()) return;

    const newHistory = [
      id,
      ...recentSearches.filter((item) => item !== id),
    ].slice(0, 20);

    setRecentSearches(newHistory);
    localStorage.setItem("steamcalc_history", JSON.stringify(newHistory));
  };

  const clearHistory = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("steamcalc_history");
    setShowSuggestions(false);
  };

  const removeHistoryItem = (
    e: React.MouseEvent,
    idToRemove: string
  ) => {
    e.stopPropagation();

    const newHistory = recentSearches.filter((id) => id !== idToRemove);
    setRecentSearches(newHistory);
    localStorage.setItem("steamcalc_history", JSON.stringify(newHistory));

    if (newHistory.length === 0) setShowSuggestions(false);
  };

  const selectSuggestion = (value: string) => {
    setData("steam_id", value);
    setShowSuggestions(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (data.steam_id) {
      saveToHistory(data.steam_id);
    }

    setShowSuggestions(false);

    post("/steam-calculator/check", {
      onError: (err) => {
        if (err.steam_id) {
          toast.custom(
            (t) => (
              <div className="flex items-start gap-4 w-full max-w-sm bg-[#18181b] border border-red-500/20 p-4 rounded-2xl shadow-2xl shadow-red-900/20 relative overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>

                <div className="p-2 bg-red-500/10 rounded-xl shrink-0 relative z-10">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>

                <div className="flex-1 relative z-10 pt-0.5">
                  <h3 className="text-sm font-bold text-white mb-0.5">
                    Failed to Process Request
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {err.steam_id}
                  </p>
                </div>

                <button
                  onClick={() => toast.dismiss(t)}
                  className="text-gray-500 hover:text-white transition-colors relative z-10 -mt-1 -mr-1 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ),
            { duration: 2500 }
          );
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 font-sans flex flex-col items-center justify-center relative overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>

      <div className="absolute top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-1000">
        <Select
          value={data.currency}
          onValueChange={(val) => setData("currency", val)}
        >
          <SelectTrigger className="h-10 w-auto gap-2 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white backdrop-blur-md transition-all font-medium text-xs [&_svg:last-child]:hidden focus:ring-0 shadow-lg">
            <Wallet className="w-3.5 h-3.5" />
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent
            align="end"
            className="bg-[#1a1d24] border-white/10 text-white min-w-[140px]"
          >
            <SelectItem value="IDR">IDR</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
            <SelectItem value="JPY">JPY</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="absolute bottom-6 left-6 z-50 hidden sm:block">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-medium text-gray-600 backdrop-blur-sm hover:text-gray-400 hover:border-white/10 transition-colors cursor-default">
          <Sparkles className="w-3 h-3 opacity-50" />
          <span>V2.0 - Latest</span>
        </div>
      </div>

      <div className="max-w-3xl w-full px-6 z-10 flex flex-col items-center">
        <div className="text-center mb-10 space-y-6 animate-in fade-in zoom-in duration-700">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-sm leading-tight">
            SteamCalc
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              .Neo
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
            Check your Steam account value, ban history, and playtime stats instantly.
          </p>
        </div>

        <div
          ref={dropdownRef}
          className="w-full max-w-xl relative group animate-in slide-in-from-bottom-8 duration-700 delay-150 z-50"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-50 blur transition duration-500"></div>

          <form onSubmit={submit} className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-30">
              <Gamepad2 className="w-6 h-6" />
            </div>

            <Input
              id="steam_id"
              type="text"
              value={data.steam_id}
              onChange={(e) => setData("steam_id", e.target.value)}
              onFocus={() =>
                recentSearches.length > 0 && setShowSuggestions(true)
              }
              placeholder="Enter Steam ID or Custom URL..."
              className="w-full h-16 pl-14 pr-36 bg-[#09090b]/90 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-full text-lg text-white placeholder:text-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-transparent shadow-2xl transition-all relative z-20"
              autoComplete="off"
            />

            <div className="absolute right-2 top-2 bottom-2 z-30">
              <Button
                type="submit"
                disabled={processing}
                size="lg"
                className="h-full rounded-full px-6 bg-white text-black hover:bg-gray-200 font-bold transition-all active:scale-95 shadow-lg"
              >
                {processing ? (
                  <span className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Check</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </form>

          {showSuggestions && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-40">
              <div className="flex items-center justify-between px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <History className="w-3 h-3" /> Search History
                </span>
                <button
                  onClick={(e) => clearHistory(e)}
                  className="hover:text-red-400 transition-colors text-[9px]"
                >
                  CLEAR ALL
                </button>
              </div>

              {recentSearches.slice(0, 2).map((id, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div
                    className="flex items-center gap-3 overflow-hidden flex-1"
                    onClick={() => selectSuggestion(id)}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-blue-500/20 transition-colors border border-white/5 group-hover:border-blue-500/30">
                      <History className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white truncate font-medium">
                      {id}
                    </span>
                  </div>

                  <button
                    onClick={(e) => removeHistoryItem(e, id)}
                    className="text-gray-600 hover:text-red-400 p-1.5 rounded-md hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {recentSearches.length > 3 && (
                <div className="mt-1 px-1 pb-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full text-xs text-gray-400 hover:text-white hover:bg-white/5 h-9 gap-2 justify-center border border-white/5 bg-black/20"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                        View All ({recentSearches.length})
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="bg-[#121212] border-white/10 text-white max-w-md max-h-[80vh] flex flex-col p-0 overflow-hidden shadow-2xl">
                      <DialogHeader className="p-6 pb-4 border-b border-white/5 bg-[#171a21]">
                        <DialogTitle className="flex items-center gap-2 text-lg">
                          <History className="w-5 h-5 text-blue-400" />
                          Complete Search History
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 text-xs">
                          All searches stored on this device.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {recentSearches.map((id, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors group"
                          >
                            <div
                              className="flex items-center gap-3 cursor-pointer flex-1 overflow-hidden"
                              onClick={() => selectSuggestion(id)}
                            >
                              <div className="w-8 h-8 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <History className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                                {id}
                              </span>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => removeHistoryItem(e, id)}
                              className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border-t border-white/5 bg-[#0c0e11]">
                        <Button
                          variant="destructive"
                          className="w-full bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-500/20"
                          onClick={(e) => clearHistory(e)}
                        >
                          Clear Entire History
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-20 flex gap-8 text-xs text-gray-600 font-medium uppercase tracking-widest">
          <Dialog>
            <DialogTrigger className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </DialogTrigger>
            <DialogContent className="bg-[#0f1216] border-white/10 text-gray-300 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white mb-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Privacy Policy
                </DialogTitle>
                <DialogDescription>
                  How we handle and process your data.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm leading-relaxed mt-2">
                <p>
                  <strong>1. Public Data:</strong> SteamCalc only retrieves data
                  that is publicly available through the Steam Web API. Private
                  profiles cannot be accessed.
                </p>
                <p>
                  <strong>2. Data Storage:</strong> We do not permanently store
                  your profile data. All information is fetched live on every
                  request.
                </p>
                <p>
                  <strong>3. Login:</strong> No Steam login (OpenID) is
                  required. We only ask for your Steam ID or Custom URL, making
                  this app safe from phishing attempts.
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger className="hover:text-gray-300 transition-colors">
              Terms
            </DialogTrigger>
            <DialogContent className="bg-[#0f1216] border-white/10 text-gray-300 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white mb-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Terms & Conditions
                </DialogTitle>
                <DialogDescription>
                  Usage limitations and responsibilities.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm leading-relaxed mt-2">
                <p>
                  <strong>1. Affiliation:</strong> SteamCalc is not affiliated
                  with Valve Corporation. Steam is a registered trademark of
                  Valve.
                </p>
                <p>
                  <strong>2. Data Accuracy:</strong> Account value is calculated
                  from current store pricing and may differ due to discounts,
                  bundles, or regional adjustments.
                </p>
                <p>
                  <strong>3. Fair Use:</strong> Do not spam or attempt to abuse
                  the API services.
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger className="hover:text-gray-300 transition-colors flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Status
            </DialogTrigger>
            <DialogContent className="bg-[#0f1216] border-white/10 text-gray-300 max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white mb-4">
                  <Activity className="w-5 h-5 text-green-400" />
                  System Status
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Real-time status of all API services.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-sm font-medium">Steam Web API</span>
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    Operational
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-sm font-medium">Community CDN</span>
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    Operational
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-sm font-medium">ID Resolver</span>
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    Operational
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 text-center pt-2">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Toaster position="top-center" theme="dark" />
    </div>
  );
}
