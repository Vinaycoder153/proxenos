import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, AlertTriangle, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/server";
import { Task, Habit, HabitLog } from "@/lib/types";
import { generateAIFeedback } from "@/lib/ai";

export const dynamic = 'force-dynamic'; // Ensure real-time data

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Parallel data fetching
    const [tasksRes, habitsRes, logsRes] = await Promise.all([
        supabase.from("tasks").select("*").eq("user_id", user.id).neq("status", "completed").order("priority", { ascending: false }).limit(20),
        supabase.from("habits").select("*").eq("user_id", user.id),
        supabase.from("habit_logs").select("*").eq("user_id", user.id).eq("completed_at", new Date().toISOString().split('T')[0])
    ]);

    const tasks = (tasksRes.data as Task[]) || [];
    const habits = (habitsRes.data as Habit[]) || [];
    const logs = (logsRes.data as HabitLog[]) || [];

    const completedHabitIds = new Set(logs.map(l => l.habit_id));

    // AI Analysis
    const aiFeedback = await generateAIFeedback(tasks, habits, logs);

    const pendingCount = tasks.filter(t => t.status === 'pending').length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header / HUD */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-primary neon-text mb-1">
                        <Terminal className="h-4 w-4" />
                        <span className="text-xs font-mono uppercase tracking-widest">System Online</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Command Center</h1>
                    <p className="text-muted-foreground font-mono text-sm mt-1">OPERATOR: {user.email?.split('@')[0].toUpperCase()}</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">System Integrity</div>
                    <div className="text-4xl font-black text-primary neon-text">{aiFeedback.score}%</div>
                </div>
            </div>

            {/* AI Directives Banner */}
            <div className="glass rounded-lg border-l-4 border-l-primary p-6">
                <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg text-primary tracking-wide">ATTENTION OPERATOR</h3>
                        <p className="text-white font-medium text-lg">"{aiFeedback.roast}"</p>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded inline-block font-mono text-sm border border-primary/20">
                            DIRECTIVE: {aiFeedback.directive}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Main Task Feed */}
                <div className="md:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Mission Critical</h2>
                        <Badge variant="outline" className="font-mono text-xs">{pendingCount} PENDING</Badge>
                    </div>

                    <ScrollArea className="h-[400px] glass rounded-xl border border-white/5 p-4">
                        <div className="space-y-3">
                            {tasks.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground font-mono">
                                    ALL SYSTEMS NOMINAL. NO PENDING DIRECTIVES.
                                </div>
                            ) : (
                                tasks.map((task) => (
                                    <div key={task.id} className="group flex items-center justify-between p-4 rounded-lg bg-black/20 hover:bg-primary/5 border border-white/5 hover:border-primary/30 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className={`mt-0.5 ${task.status === 'completed' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'}`}>
                                                <Circle className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-foreground group-hover:text-white transition-colors text-sm md:text-base">{task.title}</h4>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5 font-mono">
                                                    {task.due_date && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.due_date}</span>}
                                                    <span className={`${task.priority === 'High' ? 'text-red-400' : ''}`}>{task.priority.toUpperCase()} PRIORITY</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10">
                                            COMPLETE
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Sidebar: Habits & Stats */}
                <div className="md:col-span-4 space-y-6">
                    <h2 className="text-xl font-bold tracking-tight">Daily Protocol</h2>
                    <div className="glass rounded-xl p-6 space-y-6">
                        <div className="space-y-4">
                            {habits.map((habit) => {
                                const isCompleted = completedHabitIds.has(habit.id);
                                return (
                                    <div key={habit.id} className="flex items-center justify-between group">
                                        <span className={`text-sm font-medium transition-colors ${isCompleted ? 'text-muted-foreground line-through decoration-primary/50' : 'text-foreground'}`}>
                                            {habit.title}
                                        </span>
                                        <div className={`h-6 w-6 rounded border flex items-center justify-center transition-all duration-300 ${isCompleted
                                            ? 'bg-primary border-primary text-black'
                                            : 'border-white/10 bg-black/20 group-hover:border-primary/50'
                                            }`}>
                                            {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                                        </div>
                                    </div>
                                );
                            })}
                            {habits.length === 0 && <div className="text-xs text-muted-foreground font-mono">NO PROTOCOLS DEFINED.</div>}
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-mono text-xs tracking-widest" asChild>
                                <Link href="/dashboard/habits">CONFIGURE PROTOCOLS</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Compact Analysis Card */}
                    <div className="glass rounded-xl p-5 border border-white/5">
                        <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">System Analytics</h3>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            {aiFeedback.analysis}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
