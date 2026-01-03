"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { useSettings } from "@/lib/hooks/use-settings";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const { settings } = useSettings();

    return (
        <div className={cn(
            "flex min-h-screen bg-background selection:bg-primary/30 selection:text-white relative overflow-hidden",
            settings.noise && "noise",
            settings.scanlines && "scanlines",
            !settings.glow && "no-glow"
        )}>
            <CommandPalette />
            {/* Ambient background effect */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary),0.05),transparent_40%)] pointer-events-none" />

            {/* Desktop Sidebar */}
            <div className="hidden md:block md:w-72 md:fixed md:inset-y-0 z-50">
                <Sidebar className="h-full" />
            </div>

            {/* Main Wrapper */}
            <div className="flex-1 md:pl-72 flex flex-col min-h-screen relative z-10">
                {/* Global Header */}
                <header className="h-16 flex items-center justify-between px-6 md:px-10 border-b border-white/5 bg-background/20 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-white transition-colors">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72 border-r border-white/10 bg-black/90 backdrop-blur-2xl">
                                <Sidebar className="border-none" />
                            </SheetContent>
                        </Sheet>

                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 transition-all cursor-pointer group w-64">
                            <Search className="h-4 w-4 group-hover:text-primary transition-colors" />
                            <span className="text-sm font-mono tracking-tight group-hover:text-white">Cmd + K to Search...</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-all relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-ping" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-0.5 border border-white/10 cursor-pointer hover:scale-110 transition-transform">
                            <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                                <span className="text-[10px] font-black">OP</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full">
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out fill-mode-forwards">
                        {children}
                    </div>
                </main>

                {/* Footer HUD (Subtle) */}
                <footer className="py-4 px-10 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-4">
                        <span>Nexus Core v4.0.2</span>
                        <span className="text-primary/30">|</span>
                        <span>Protocol: TCP/IP-AI</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                        <span>System Latency: 24ms</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
