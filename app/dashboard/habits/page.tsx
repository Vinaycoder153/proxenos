"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap, Loader2, ArrowRight } from "lucide-react";
import { Habit } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [todayLogs, setTodayLogs] = useState<string[]>([]); // Set of habit IDs
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        // Parallel Fetching
        const [habitsRes, logsRes] = await Promise.all([
            fetch("/api/habits"),
            supabase.from("habit_logs").select("*").eq("completed_at", new Date().toISOString().split('T')[0])
        ]);

        if (habitsRes.ok) {
            setHabits(await habitsRes.json());
        }

        if (logsRes.data) {
            setTodayLogs(logsRes.data.map((l: any) => l.habit_id));
        }

        setLoading(false);
    }

    async function toggleHabit(habitId: string, currentStatus: boolean) {
        // Optimistic Update
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
                date: new Date().toISOString().split('T')[0],
                completed: newStatus
            })
        });
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Daily Protocols</h1>
                <p className="text-muted-foreground">Maintain your streaks. Build the system.</p>
            </div>

            {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : habits.length === 0 ? (
                <div className="text-center py-20 border rounded-lg border-dashed border-primary/20 bg-primary/5">
                    <h3 className="text-xl font-semibold mb-2 neon-text">System Not Initialized</h3>
                    <p className="text-muted-foreground mb-6">Load standard operating protocols to begin.</p>
                    <Button onClick={async () => {
                        setLoading(true);
                        await fetch("/api/habits/init", { method: "POST" });
                        fetchData();
                    }}>
                        Initialize Protocols <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {habits.map((habit) => {
                        const isCompleted = todayLogs.includes(habit.id);
                        return (
                            <Card key={habit.id} className={`transition-all hover:bg-card/80 border-border/50 ${isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-card/40'}`}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                        {habit.title}
                                    </CardTitle>
                                    <Zap className={`h-4 w-4 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="space-y-1">
                                            <div className="text-2xl font-bold">{isCompleted ? 1 : 0} <span className="text-xs font-normal text-muted-foreground">days streak</span></div>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{habit.description || "Daily protocol."}</p>
                                        </div>
                                        <Checkbox
                                            checked={isCompleted}
                                            onCheckedChange={() => toggleHabit(habit.id, isCompleted)}
                                            className="h-6 w-6"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <Progress value={isCompleted ? 100 : 0} className="h-1 bg-secondary" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
