"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Zap, Settings, ClipboardList, LogOut, BarChart3, Shield } from "lucide-react";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Mission Log",
            icon: CheckSquare,
            href: "/dashboard/tasks",
            active: pathname === "/dashboard/tasks",
        },
        {
            label: "Daily Protocols",
            icon: Zap,
            href: "/dashboard/habits",
            active: pathname === "/dashboard/habits",
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/dashboard/analytics",
            active: pathname === "/dashboard/analytics",
        },
        {
            label: "System Reviews",
            icon: ClipboardList,
            href: "/dashboard/reviews",
            active: pathname === "/dashboard/reviews",
        },
    ];

    return (
        <div className={cn("pb-12 w-72 border-r border-white/5 min-h-screen bg-black/40 backdrop-blur-xl animate-slide-in-right", className)}>
            <div className="space-y-6 py-8">
                <div className="px-6 py-2">
                    <div className="flex items-center gap-3 mb-10 group cursor-pointer">
                        <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                            <Shield className="h-6 w-6 text-primary neon-text" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter text-white gradient-text">
                            NEXUS <span className="text-primary/50 text-xs font-mono ml-1">v4.0</span>
                        </h2>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4 px-2">
                            Navigation Modules
                        </p>
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group",
                                    route.active
                                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                <route.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", route.active ? "text-primary" : "text-muted-foreground")} />
                                <span className="tracking-wide">{route.label}</span>
                                {route.active && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-2 mt-auto">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4 px-2">
                        Core System
                    </p>
                    <div className="space-y-2">
                        <Link
                            href="/dashboard/settings"
                            className={cn(
                                "flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group",
                                pathname === "/dashboard/settings"
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Settings className={cn("h-5 w-5 transition-transform group-hover:rotate-45", pathname === "/dashboard/settings" ? "text-primary" : "")} />
                            <span className="tracking-wide">Settings</span>
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="flex w-full items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-red-400 hover:bg-red-400/10 group"
                            >
                                <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="tracking-wide">Disconnect Session</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="mx-6 p-4 rounded-xl bg-primary/5 border border-primary/10 mt-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-green-500/80 uppercase">All Waves Normal</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/40 w-2/3" />
                    </div>
                </div>
            </div>
        </div>
    );
}
