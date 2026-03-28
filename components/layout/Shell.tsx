"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search, Bell, LayoutDashboard, CheckSquare, Zap, BarChart3, ClipboardList } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { useSettings } from "@/lib/hooks/use-settings";
import { cn } from "@/lib/utils";

const mobileNavRoutes = [
    { label: "Home", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Tasks", icon: CheckSquare, href: "/dashboard/tasks" },
    { label: "Habits", icon: Zap, href: "/dashboard/habits" },
    { label: "Stats", icon: BarChart3, href: "/dashboard/analytics" },
    { label: "Reviews", icon: ClipboardList, href: "/dashboard/reviews" },
];

export function Shell({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const { settings } = useSettings();
    const pathname = usePathname();

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
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 md:px-10 border-b border-white/5 bg-background/20 backdrop-blur-md sticky top-0 z-40">
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

                        {/* Mobile brand name */}
                        <span className="md:hidden text-sm font-black tracking-tighter gradient-text">NEXUS</span>
                    </div>

                    <div className="flex items-center gap-3">
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
                <main className="flex-1 p-4 sm:p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full pb-24 md:pb-10 lg:pb-12">
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out fill-mode-forwards">
                        {children}
                    </div>
                </main>

                {/* Footer HUD (Desktop only) */}
                <footer className="hidden md:flex py-4 px-10 border-t border-white/5 items-center justify-between text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
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

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-1">
                {mobileNavRoutes.map((route) => {
                    const isActive = pathname === route.href;
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[52px] relative",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {isActive && (
                                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full shadow-[0_0_6px_var(--primary)]" />
                            )}
                            <div className={cn(
                                "p-1 rounded-lg transition-all duration-200",
                                isActive && "bg-primary/10"
                            )}>
                                <route.icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
                            </div>
                            <span className={cn(
                                "text-[9px] font-mono uppercase tracking-wide",
                                isActive ? "text-primary" : "text-muted-foreground/50"
                            )}>
                                {route.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
