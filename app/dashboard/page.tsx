import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertTriangle, Terminal, TrendingUp, Activity, BarChart3, Shield, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/server";
import { Task, Habit, HabitLog } from "@/lib/types";
import { generateAIFeedback, generateDailyPlan } from "@/lib/ai";
import { PomodoroTimer } from "@/components/dashboard/pomodoro-timer";
import { Progress } from "@/components/ui/progress";
import { AISuggestions } from "@/components/dashboard/ai-suggestions";
import { DailyBriefing } from "@/components/dashboard/daily-briefing";
import { StatsCard } from "@/components/dashboard/stats-card";
import { cn, getTodayDate } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const [tasksRes, habitsRes, logsRes] = await Promise.all([
        supabase.from("tasks").select("*").eq("user_id", user.id).neq("status", "completed").order("priority", { ascending: false }).limit(20),
        supabase.from("habits").select("*").eq("user_id", user.id),
        supabase.from("habit_logs").select("*").eq("user_id", user.id).eq("completed_at", getTodayDate())
    ]);

    const tasks = (tasksRes.data as Task[]) || [];
    const habits = (habitsRes.data as Habit[]) || [];
    const logs = (logsRes.data as HabitLog[]) || [];

    const completedHabitIds = new Set(logs.map(l => l.habit_id));

    // AI Analysis
    const [aiFeedback, dailyPlan] = await Promise.all([
        generateAIFeedback(tasks, habits, logs),
        generateDailyPlan(tasks, habits)
    ]);

    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const completionRate = habits.length > 0 ? Math.round((logs.length / habits.length) * 100) : 0;

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-1000">
            {/* HUD Header */}
            <div className="relative group overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 md:p-12 mb-10">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield className="h-48 w-48 text-primary" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                            <span className="text-xs font-mono uppercase tracking-[0.5em] text-primary">System Online: Neural Link Stable</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                            COMMAND <span className="gradient-text">CENTER</span>
                        </h1>
                        <div className="flex items-center gap-4 text-muted-foreground font-mono text-sm uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 w-fit">
                            <span className="text-primary/60">Operator:</span>
                            <span className="text-white">{user.email?.split('@')[0]}</span>
                            <span className="text-white/20">|</span>
                            <span className="text-primary/60">Sector:</span>
                            <span className="text-white">A-01</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 md:gap-12 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
                        <div className="text-center space-y-2">
                            <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.3em]">Neural Load</div>
                            <div className="text-5xl font-black tracking-tighter text-white tabular-nums">
                                {pendingCount}<span className="text-primary text-2xl font-mono">/20</span>
                            </div>
                        </div>
                        <div className="h-16 w-px bg-white/10" />
                        <div className="text-right space-y-2">
                            <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.3em]">Integrity Score</div>
                            <div className="text-5xl font-black tracking-tighter gradient-text tabular-nums">{aiFeedback.score}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Active Objectives", value: pendingCount, icon: Target, color: "text-orange-500", detail: "System queue depth" },
                    { label: "Protocol Compliance", value: `${completionRate}%`, icon: Shield, color: "text-primary", detail: `${logs.length}/${habits.length} Records log`, bar: true, barValue: completionRate },
                    { label: "Neural Velocity", value: "94.2", icon: Zap, color: "text-yellow-500", detail: "Tasks/hour avg" },
                    { label: "System Uptime", value: "14.2d", icon: Activity, color: "text-blue-500", detail: "Current streak" },
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

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left Column: Mission Log & AI Insights */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Mission Critical Feed */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <Terminal className="h-5 w-5 text-primary" />
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white">MISSION CRITICAL</h2>
                            </div>
                            <Button asChild size="sm" variant="outline" className="h-9 border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all">
                                <Link href="/dashboard/tasks">Access Full Log</Link>
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            {tasks.length === 0 ? (
                                <Card className="glass border-dashed border-white/10 py-20 text-center">
                                    <p className="text-xs font-mono text-muted-foreground/40 uppercase tracking-[0.4em]">All sectors clear. No pending objectives.</p>
                                </Card>
                            ) : (
                                tasks.map((task, i) => (
                                    <div
                                        key={task.id}
                                        className="group relative flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-300 card-hover"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center border transition-all duration-500",
                                                task.priority === 'High' ? "border-red-500/20 bg-red-500/5 text-red-400 group-hover:bg-red-500/10" :
                                                    task.priority === 'Medium' ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-400 group-hover:bg-yellow-500/10" :
                                                        "border-green-500/20 bg-green-500/5 text-green-400 group-hover:bg-green-500/10"
                                            )}>
                                                <Target className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors">{task.title}</h4>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="text-[8px] h-4 font-mono uppercase tracking-widest border-white/5 bg-white/5 text-muted-foreground">
                                                        {task.priority} Priority
                                                    </Badge>
                                                    {task.due_date && (
                                                        <span className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/60 uppercase">
                                                            <Clock className="h-3 w-3" /> {task.due_date}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Button asChild size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 h-9 px-4 rounded-lg bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all">
                                            <Link href="/dashboard/tasks">ENGAGE</Link>
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* AI Feedback Section */}
                    <div className="relative overflow-hidden rounded-3xl group">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                        <div className="relative p-8 border border-primary/20 flex flex-col md:flex-row gap-8 items-center">
                            <div className="shrink-0 p-5 rounded-2xl bg-primary/10 border border-primary/20 animate-pulse-glow">
                                <Activity className="h-10 w-10 text-primary" />
                            </div>
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-mono text-primary uppercase tracking-[0.4em]">Direct Neural Feedback</h3>
                                    <div className="h-px flex-1 bg-primary/20" />
                                </div>
                                <p className="text-2xl font-black italic tracking-tight text-white leading-tight">
                                    &quot;{aiFeedback.roast}&quot;
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <div className="px-4 py-1.5 rounded-lg bg-black/40 border border-primary/20 text-xs font-mono text-primary uppercase tracking-widest">
                                        Active Directive: {aiFeedback.directive}
                                    </div>
                                    <div className="px-4 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                                        Optimization: {aiFeedback.analysis}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Suggestions & System Status */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Daily Briefing */}
                    <DailyBriefing plan={dailyPlan} />
                    {/* Neural Insights Component */}
                    <AISuggestions tasks={tasks} habits={habits} logs={logs} />

                    {/* Pomodoro Timer */}
                    <PomodoroTimer />

                    {/* Protocol Segments (Habits) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                <h2 className="text-sm font-black uppercase tracking-widest text-white">Daily Protocols</h2>
                            </div>
                            <Link href="/dashboard/habits" className="text-[10px] font-mono text-primary hover:underline uppercase tracking-widest">Config</Link>
                        </div>

                        <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                            {habits.slice(0, 5).map((habit) => {
                                const isCompleted = completedHabitIds.has(habit.id);
                                return (
                                    <div key={habit.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-2 w-2 rounded-full transition-all duration-500",
                                                isCompleted ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-white/10 group-hover:bg-white/30"
                                            )} />
                                            <span className={cn(
                                                "text-sm font-medium transition-all group-hover:translate-x-1",
                                                isCompleted ? "text-muted-foreground line-through decoration-primary/30" : "text-white group-hover:text-primary"
                                            )}>
                                                {habit.title}
                                            </span>
                                        </div>
                                        {isCompleted && <CheckCircle2 className="h-4 w-4 text-primary animate-pulse" />}
                                    </div>
                                );
                            })}

                            {habits.length === 0 && (
                                <div className="text-[10px] font-mono text-muted-foreground/30 text-center py-6">
                                    [NO ACTIVE PROTOCOLS]
                                </div>
                            )}

                            <div className="pt-4 border-t border-white/5">
                                <Button asChild variant="outline" className="w-full h-10 border-white/5 bg-white/5 text-[10px] font-mono uppercase tracking-widest hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all">
                                    <Link href="/dashboard/habits">Initialize Bio-Stream</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* System Status HUD */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Network Latency</span>
                            <span className="text-[9px] font-mono text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                                24ms Stable
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Process Segments</span>
                            <span className="text-[9px] font-mono text-white/40">v4.0.2.build_881</span>
                        </div>
                        <div className="pt-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest">Weekly Convergence</span>
                                <span className="text-[8px] font-mono text-primary/60">88%</span>
                            </div>
                            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary/40 w-[88%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
