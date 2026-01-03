"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Clock, CheckCircle2, Circle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DailyPlan {
    schedule: { time: string; activity: string; type: 'work' | 'habit' | 'break' }[];
    focus_score: number;
    strategy: string;
}

interface DailyBriefingProps {
    plan: DailyPlan;
}

export function DailyBriefing({ plan }: DailyBriefingProps) {
    if (!plan || !plan.schedule.length) return null;

    return (
        <Card className="glass border-primary/20 bg-black/20 group relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all duration-1000 group-hover:bg-primary/10" />

            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-mono uppercase tracking-[0.3em] flex items-center gap-2 text-primary">
                    <BrainCircuit className="h-4 w-4" />
                    Neural Schedule
                </CardTitle>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        Focus Pred: <span className="text-white">{plan.focus_score}%</span>
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs font-mono text-primary/80 uppercase tracking-wide leading-relaxed">
                    Strategy: {plan.strategy}
                </div>

                <div className="relative border-l border-white/10 ml-2 space-y-6 py-2">
                    {plan.schedule.map((item, i) => (
                        <div key={i} className="relative pl-6 group/item">
                            {/* Timeline Node */}
                            <div className={cn(
                                "absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 transition-all duration-300",
                                item.type === 'work' ? "border-blue-500 bg-black group-hover/item:bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" :
                                    item.type === 'habit' ? "border-green-500 bg-black group-hover/item:bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
                                        "border-white/20 bg-black group-hover/item:border-white/50"
                            )} />

                            <div className="flex flex-col gap-1">
                                <span className={cn(
                                    "text-[10px] font-mono uppercase tracking-widest transition-colors",
                                    item.type === 'work' ? "text-blue-400" :
                                        item.type === 'habit' ? "text-green-400" :
                                            "text-muted-foreground"
                                )}>
                                    {item.time} // {item.type}
                                </span>
                                <span className="text-sm font-medium text-white/90 group-hover/item:text-white transition-colors cursor-default">
                                    {item.activity}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
