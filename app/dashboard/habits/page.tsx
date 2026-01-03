"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap, Loader2, ArrowRight, Flame, Trophy, Target, TrendingUp, Calendar, Shield, Info, Activity } from "lucide-react";
import { Habit, HabitLog } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn, getTodayDate, formatDateToISO } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

export default function EnhancedHabitsPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [todayLogs, setTodayLogs] = useState<string[]>([]);
    const [allLogs, setAllLogs] = useState<HabitLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [streaks, setStreaks] = useState<Record<string, number>>({});
    const [recoveryHabit, setRecoveryHabit] = useState<string | null>(null);
    const [recoveryDate, setRecoveryDate] = useState(formatDateToISO(new Date(Date.now() - 86400000)));

    const supabase = createClient();
    const { toast } = useToast();

    const fetchData = async () => {
        const [habitsRes, logsRes, allLogsRes] = await Promise.all([
            fetch("/api/habits"),
            supabase.from("habit_logs").select("*").eq("completed_at", getTodayDate()),
            supabase.from("habit_logs").select("*").order("completed_at", { ascending: false })
        ]);

        if (habitsRes.ok) {
            const habitsData = await habitsRes.json();
            setHabits(habitsData);
        }

        if (logsRes.data) {
            setTodayLogs(logsRes.data.map((l) => l.habit_id));
        }

        if (allLogsRes.data) {
            setAllLogs(allLogsRes.data);
            calculateStreaks(allLogsRes.data);
        }

        setLoading(false);
    };

    const calculateStreaks = useCallback((logs: HabitLog[]) => {
        const streakMap: Record<string, number> = {};

        habits.forEach(habit => {
            const habitLogs = logs
                .filter(log => log.habit_id === habit.id)
                .map(log => log.completed_at)
                .sort()
                .reverse();

            let streak = 0;
            const checkDate = new Date();

            // Handle current streak calculation
            for (let i = 0; i < habitLogs.length; i++) {
                const logDate = habitLogs[i];
                const expectedDate = checkDate.toISOString().split('T')[0];

                if (logDate === expectedDate) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else if (logDate < expectedDate) {
                    // Missed a day
                    break;
                }
            }

            streakMap[habit.id] = streak;
        });

        setStreaks(streakMap);
    }, [habits]);

    useEffect(() => {
        fetchData();
    }, []);

    // Recalculate streaks only when habits or logs change
    useEffect(() => {
        if (habits.length > 0 && allLogs.length > 0) {
            calculateStreaks(allLogs);
        }
    }, [habits.length, allLogs.length, calculateStreaks]);


    async function toggleHabit(habitId: string, currentStatus: boolean) {
        const newStatus = !currentStatus;
        if (newStatus) {
            setTodayLogs([...todayLogs, habitId]);
        } else {
            setTodayLogs(todayLogs.filter(id => id !== habitId));
        }

        await fetch("/api/habit-log", {
            method: "POST",
            body: JSON.stringify({
                habit_id: habitId,
                date: getTodayDate(),
                completed: newStatus
            })
        });

        if (newStatus) {
            toast({
                title: "Protocol Success! 🎯",
                description: "Habit verified and logged in secure registry",
                variant: "success",
            });
        }

        fetchData();
    }

    async function recoverStreak(habitId: string, date: string) {
        await fetch("/api/habit-log", {
            method: "POST",
            body: JSON.stringify({
                habit_id: habitId,
                date: date,
                completed: true
            })
        });

        toast({
            title: "Streak Recovered",
            description: `Past record for ${date} has been updated.`,
            variant: "success",
        });

        setRecoveryHabit(null);
        fetchData();
    }

    const completionRate = habits.length > 0
        ? Math.round((todayLogs.length / habits.length) * 100)
        : 0;

    const totalStreakDays = Object.values(streaks).reduce((sum, val) => sum + val, 0);

    const longestStreak = Math.max(...Object.values(streaks), 0);

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                title="DAILY PROTOCOLS"
                label="Bio-Protocol Module"
                icon={Activity}
                count={`${habits.length} ACTIVE`}
            />

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: "Daily Completion", value: `${completionRate}%`, detail: `${todayLogs.length}/${habits.length} Active`, icon: Target, color: "text-primary", bar: true, barValue: completionRate },
                    { label: "Cumulative Energy", value: totalStreakDays, detail: "Total Streak Days", icon: Flame, color: "text-orange-500" },
                    { label: "Elite Streak", value: longestStreak, detail: "Longest Record", icon: Trophy, color: "text-yellow-500" },
                    { label: "System Sync", value: "98.2%", detail: "Reliability score", icon: TrendingUp, color: "text-blue-500" },
                ].map((stat, i) => (
                    <StatsCard
                        key={i}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        detail={stat.detail}
                        bar={stat.bar}
                        barValue={stat.barValue}
                    />
                ))}
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
            ) : habits.length === 0 ? (
                <Card className="glass border-dashed border-primary/20 bg-primary/5">
                    <CardContent className="p-20 text-center">
                        <Zap className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse" />
                        <h3 className="text-2xl font-black mb-2 text-white uppercase tracking-tighter">System Protocols Uninitialized</h3>
                        <p className="text-muted-foreground mb-10 font-mono text-xs uppercase tracking-widest">Connect to neural network to load standard operating protocols.</p>
                        <Button
                            onClick={async () => {
                                setLoading(true);
                                await fetch("/api/habits/init", { method: "POST" });
                                fetchData();
                            }}
                            className="bg-primary text-black hover:bg-primary/90 glow-active px-10 h-14 font-black uppercase tracking-[0.2em]"
                        >
                            <ArrowRight className="mr-2 h-5 w-5" />
                            Initialize Bio-Stream
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {habits.map((habit) => {
                        const isCompleted = todayLogs.includes(habit.id);
                        const streak = streaks[habit.id] || 0;

                        return (
                            <Card
                                key={habit.id}
                                className={cn(
                                    "glass border-white/5 transition-all duration-500 relative overflow-hidden group",
                                    isCompleted ? "bg-primary/5 border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.05)]" : "hover:border-white/20"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 transition-all duration-700 group-hover:scale-125",
                                    isCompleted ? "text-primary" : "text-white"
                                )}>
                                    <Zap className="w-full h-full" />
                                </div>

                                <CardHeader className="pb-4 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h3 className={cn(
                                                "text-lg font-black tracking-tight uppercase transition-colors",
                                                isCompleted ? "text-primary" : "text-white"
                                            )}>
                                                {habit.title}
                                            </h3>
                                            <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider line-clamp-1">
                                                {habit.description || "Active Neural Protocol"}
                                            </p>
                                        </div>
                                        <Checkbox
                                            checked={isCompleted}
                                            onCheckedChange={() => toggleHabit(habit.id, isCompleted)}
                                            className="h-6 w-6 border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300 shadow-[0_0_10px_transparent] data-[state=checked]:shadow-primary/50"
                                        />
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6 relative z-10">
                                    <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                                        <div className="space-y-0.5">
                                            <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">Current Multiplier</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className={cn("text-3xl font-black italic tracking-tighter", streak > 0 ? "text-primary" : "text-white/20")}>
                                                    x{streak}
                                                </span>
                                                <span className="text-[10px] font-mono text-muted-foreground/40 uppercase">Day Streak</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {streak >= 7 && (
                                                <Badge variant="outline" className="text-[8px] border-yellow-500/30 text-yellow-500 bg-yellow-500/5 font-mono uppercase px-1.5 h-4">
                                                    Elite Class
                                                </Badge>
                                            )}
                                            <div className="flex gap-1">
                                                {[...Array(7)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "h-1.5 w-1.5 rounded-full transition-all duration-500",
                                                            i < (streak % 7) ? "bg-primary shadow-[0_0_5px_var(--primary)]" : "bg-white/10"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 h-9 rounded-lg border-white/5 bg-white/5 text-[10px] font-mono uppercase tracking-widest hover:bg-white/10"
                                            onClick={() => {
                                                setRecoveryHabit(habit.id);
                                                setRecoveryDate(formatDateToISO(new Date(Date.now() - 86400000)));
                                            }}
                                        >
                                            <Shield className="h-3 w-3 mr-2 text-primary" />
                                            Recover Past
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 w-9 p-0 border-white/5 bg-white/5 hover:bg-white/10"
                                        >
                                            <Info className="h-3.5 w-3.5 text-muted-foreground/40" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Streak Recovery Dialog */}
            <Dialog open={!!recoveryHabit} onOpenChange={() => setRecoveryHabit(null)}>
                <DialogContent className="glass border-primary/20 bg-black/90 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                            <Shield className="h-6 w-6 text-primary" />
                            Streak Recovery Mode
                        </DialogTitle>
                        <DialogDescription className="font-mono text-xs uppercase tracking-widest text-muted-foreground pt-2">
                            Emergency protocol to restore neural links.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest ml-1">Protocol Segment (Date)</label>
                            <input
                                type="date"
                                className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 font-mono text-sm text-white focus:border-primary/50 outline-none transition-all"
                                value={recoveryDate}
                                onChange={(e) => setRecoveryDate(e.target.value)}
                            />
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-4">
                            <Info className="h-5 w-5 text-primary shrink-0" />
                            <p className="text-[10px] font-mono text-primary/80 uppercase leading-relaxed">
                                Warning: Recovery protocols should only be initialized if a biological link was actually established but not recorded.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            className="flex-1 h-12 uppercase font-black text-xs tracking-widest text-muted-foreground hover:bg-white/5"
                            onClick={() => setRecoveryHabit(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 h-12 bg-primary text-black font-black uppercase text-xs tracking-widest hover:glow-active"
                            onClick={() => recoveryHabit && recoverStreak(recoveryHabit, recoveryDate)}
                        >
                            Restore Link
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
