import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string | React.ReactNode;
    subtitle?: string;
    label: string;
    icon: LucideIcon;
    iconColor?: string;
    count?: number | string;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    subtitle,
    label,
    icon: Icon,
    iconColor = "text-primary",
    count,
    children,
    className
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5", className)}>
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                    <Icon className={cn("h-5 w-5", iconColor)} />
                    <span className={cn("text-[10px] font-mono uppercase tracking-[0.3em]", iconColor ? iconColor + "/60" : "text-muted-foreground/60")}>
                        {label}
                    </span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white flex items-baseline gap-3">
                    {title}
                    {count !== undefined && (
                        <span className="text-sm font-mono text-primary/40">[{count}]</span>
                    )}
                </h1>
                {subtitle && (
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        {subtitle}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
}
