import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
    detail?: string;
    bar?: boolean;
    barValue?: number;
    className?: string;
    description?: string; // Optional alternate for detail
}

const colorToAccent: Record<string, string> = {
    'text-primary': 'var(--primary)',
    'text-orange-500': 'rgb(249,115,22)',
    'text-yellow-500': 'rgb(234,179,8)',
    'text-blue-500': 'rgb(59,130,246)',
    'text-green-500': 'rgb(34,197,94)',
    'text-red-500': 'rgb(239,68,68)',
    'text-white': 'rgba(255,255,255,0.3)',
};

export function StatsCard({
    label,
    value,
    icon: Icon,
    color = "text-white",
    detail,
    bar = false,
    barValue = 0,
    className
}: StatsCardProps) {
    const accentColor = colorToAccent[color] ?? 'var(--primary)';

    return (
        <Card className={cn(
            "glass border-white/5 bg-black/20 hover:border-primary/20 transition-all duration-500 group cursor-default overflow-hidden relative",
            className
        )}>
            {/* Top accent bar */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-muted-foreground/80">
                    {label}
                </span>
                <div
                    className="p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110"
                    style={{ background: `color-mix(in srgb, ${accentColor} 12%, transparent)` }}
                >
                    <Icon className={cn("h-4 w-4", color)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className={cn("text-3xl font-black tracking-tighter mb-1", color !== "text-white" ? "gradient-text" : "text-white")}>
                    {value}
                </div>
                {detail && (
                    <p className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-wider">
                        {detail}
                    </p>
                )}
                {bar && (
                    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${barValue}%`, background: accentColor }}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
