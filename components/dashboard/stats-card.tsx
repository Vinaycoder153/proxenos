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
    return (
        <Card className={cn(
            "glass border-white/5 bg-black/20 hover:border-primary/20 transition-all duration-500 group cursor-default",
            className
        )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-muted-foreground/80">
                    {label}
                </span>
                <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", color)} />
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
                        <div className="h-full bg-primary" style={{ width: `${barValue}%` }} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
