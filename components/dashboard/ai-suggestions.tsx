"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight, Brain, Zap, Target, AlertTriangle } from "lucide-react";
import { Task, Habit, HabitLog } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AISuggestionsProps {
    tasks: Task[];
    habits: Habit[];
    logs: HabitLog[];
}

interface Suggestion {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    action?: string;
}

export function AISuggestions({ tasks, habits, logs }: AISuggestionsProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);

    const analyzeData = () => {
        setLoading(true);
        const newSuggestions: Suggestion[] = [];

        // 1. Analyze Task Load
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        if (pendingTasks.length > 5) {
            newSuggestions.push({
                title: "Cognitive Overload Detected",
                description: `You have ${pendingTasks.length} pending objectives. Consider deferring low-priority tasks to focus on peak performance.`,
                icon: AlertTriangle,
                color: "text-orange-500",
                action: "Prune Mission Log"
            });
        }

        // 2. Analyze Habit Streaks
        habits.forEach(habit => {
            const habitLogs = logs.filter(l => l.habit_id === habit.id);
            if (habitLogs.length === 0 && habits.length > 0) {
                newSuggestions.push({
                    title: "Dormant Protocol Found",
                    description: `The '${habit.title}' habit has no recorded logs. Initialize biological link today to begin streak.`,
                    icon: Zap,
                    color: "text-primary",
                    action: "Start Protocol"
                });
            }
        });

        // 3. Time Optimization
        const completedToday = tasks.filter(t => t.status === 'completed' && t.updated_at?.split('T')[0] === new Date().toISOString().split('T')[0]);
        if (completedToday.length >= 3) {
            newSuggestions.push({
                title: "High Momentum State",
                description: "You've crushed 3 objectives already. Take a 15-min deep-rest break to sustain this neural velocity.",
                icon: Brain,
                color: "text-blue-500",
                action: "Open Breather"
            });
        }

        // 4. Default Suggestion if none
        if (newSuggestions.length === 0) {
            newSuggestions.push({
                title: "System Optimized",
                description: "All protocols are running within normal parameters. Maintain current trajectory for maximum efficiency.",
                icon: Target,
                color: "text-green-500"
            });
        }

        setSuggestions(newSuggestions.slice(0, 3));
        setLoading(false);
    };

    useEffect(() => {
        analyzeData();
    }, [tasks, habits, logs]);

    return (
        <Card className="glass border-primary/20 bg-primary/5 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />

            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono uppercase tracking-[0.3em] flex items-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Neural Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <div className="py-8 text-center animate-pulse font-mono text-xs text-muted-foreground uppercase tracking-widest">
                        Analyzing biological data...
                    </div>
                ) : (
                    suggestions.map((suggestion, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-all group/item"
                        >
                            <div className="flex gap-4">
                                <div className={cn("mt-1 shrink-0 p-2 rounded-lg bg-white/5", suggestion.color)}>
                                    <suggestion.icon className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black uppercase tracking-tight text-white group-hover/item:text-primary transition-colors">
                                        {suggestion.title}
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">
                                        {suggestion.description}
                                    </p>
                                    {suggestion.action && (
                                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mt-3 hover:gap-3 transition-all">
                                            {suggestion.action} <ArrowRight className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>

            <div className="px-6 py-3 bg-primary/5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">Confidence Score: 94%</span>
                <span className="text-[9px] font-mono text-primary/40 uppercase tracking-widest animate-pulse">Live Link Active</span>
            </div>
        </Card>
    );
}
