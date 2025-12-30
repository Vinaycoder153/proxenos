"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Zap, Settings, ClipboardList, LogOut } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

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
            label: "Tasks",
            icon: CheckSquare,
            href: "/dashboard/tasks",
            active: pathname === "/dashboard/tasks",
        },
        {
            label: "Habits",
            icon: Zap,
            href: "/dashboard/habits",
            active: pathname === "/dashboard/habits",
        },
        {
            label: "Reviews",
            icon: ClipboardList,
            href: "/dashboard/reviews",
            active: pathname === "/dashboard/reviews",
        },
    ];

    return (
        <div className={cn("pb-12 w-64 border-r border-border min-h-screen bg-sidebar", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-6 px-4 text-2xl font-bold tracking-tight text-primary neon-text">
                        NEXUS
                    </h2>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                    route.active
                                        ? "bg-primary/10 text-primary glow-active"
                                        : "text-muted-foreground hover:bg-primary/5"
                                )}
                            >
                                <route.icon className={cn("h-5 w-5", route.active && "text-primary")} />
                                {route.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        System
                    </h3>
                    <div className="space-y-1">
                        <Link
                            href="#"
                            className="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:bg-primary/5"
                        >
                            <Settings className="h-5 w-5" />
                            Settings
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-red-500 hover:bg-red-500/10"
                            >
                                <LogOut className="h-5 w-5" />
                                Disconnect
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
