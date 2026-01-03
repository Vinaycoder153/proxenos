"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Target, Zap, Calendar, Activity, Shield, Box, Signal } from "lucide-react";
import { Task, Habit, HabitLog } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AnalyticsProps {
    tasks: Task[];
    habits: Habit[];
    logs: HabitLog[];
}

export function AnalyticsDashboard({ tasks, habits, logs }: AnalyticsProps) {
    // Calculate statistics
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const missedTasks = tasks.filter(t => t.status === 'missed').length;
    const totalTasks = tasks.length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const todayCompletedHabits = logs.length;
    const habitCompletionRate = habits.length > 0 ? Math.round((todayCompletedHabits / habits.length) * 100) : 0;

    // Task status data for pie chart
    const taskStatusData = [
        { name: 'Completed', value: completedTasks, color: 'var(--primary)' },
        { name: 'Pending', value: pendingTasks, color: 'oklch(0.6 0.2 280)' },
        { name: 'Missed', value: missedTasks, color: 'oklch(0.6 0.2 25)' },
    ].filter(item => item.value > 0);

    // Weekly progress simulation
    const weeklyData = [
        { day: 'MON', tasks: 5, habits: 4, efficiency: 85 },
        { day: 'TUE', tasks: 7, habits: 5, efficiency: 92 },
        { day: 'WED', tasks: 4, habits: 3, efficiency: 78 },
        { day: 'THU', tasks: 8, habits: 5, efficiency: 95 },
        { day: 'FRI', tasks: 6, habits: 4, efficiency: 88 },
        { day: 'SAT', tasks: 3, habits: 5, efficiency: 70 },
        { day: 'SUN', tasks: 2, habits: 4, efficiency: 65 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* HUD Stats Row */}
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: "Neural Success Rate", value: `${completionRate}%`, icon: Target, color: "text-primary", sub: "Task Registry Integrity" },
                    { label: "Bio-Sync Level", value: `${habitCompletionRate}%`, icon: Zap, color: "text-yellow-500", sub: "Protocol Compliance" },
                    { label: "Operational Load", value: pendingTasks, icon: Activity, color: "text-orange-500", sub: "Active Mission Depth" },
                    { label: "Elite Protocols", value: habits.length, icon: Shield, color: "text-blue-500", sub: "Recursive Habit Strings" },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-white/5 bg-black/40 hover:border-primary/20 transition-all group overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/60">{stat.label}</span>
                            <stat.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", stat.color)} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black tracking-tighter text-white mb-1">{stat.value}</div>
                            <p className="text-[9px] font-mono text-muted-foreground uppercase opacity-40">{stat.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Real-time Efficiency Area Chart */}
                <Card className="lg:col-span-8 glass border-white/5 bg-black/40">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black uppercase tracking-tight text-white">Efficiency Convergence</CardTitle>
                                <CardDescription className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">Temporal productivity fluctuations</CardDescription>
                            </div>
                            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-mono text-[10px] uppercase tracking-widest px-3">Live Feed</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis
                                        dataKey="day"
                                        stroke="rgba(255,255,255,0.2)"
                                        style={{ fontSize: '10px', fontFamily: 'monospace' }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.2)"
                                        style={{ fontSize: '10px', fontFamily: 'monospace' }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(10, 10, 15, 0.95)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="efficiency"
                                        stroke="var(--primary)"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorEff)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Status HUD (Pie Chart) */}
                <Card className="lg:col-span-4 glass border-white/5 bg-black/40">
                    <CardHeader className="text-center">
                        <CardTitle className="text-lg font-black uppercase tracking-tight text-white">Neural Load Status</CardTitle>
                        <CardDescription className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">Mission Registry Segmentation</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={taskStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {taskStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(10, 10, 15, 0.95)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Center Stats overlay */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-5">
                            <div className="text-3xl font-black text-white">{totalTasks}</div>
                            <div className="text-[8px] font-mono uppercase text-muted-foreground tracking-widest">Total Nodes</div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4 px-4 pb-2">
                            {taskStatusData.map((item, i) => (
                                <div key={i} className="text-center space-y-1">
                                    <div className="h-1 w-full rounded-full" style={{ backgroundColor: item.color }} />
                                    <div className="text-[9px] font-mono text-white/60">{item.name}</div>
                                    <div className="text-xs font-black text-white">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Insight HUD */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex gap-5 items-center group transition-all hover:bg-white/10">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Signal className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Deep Signal Analysis</div>
                        <h4 className="text-sm font-black text-white uppercase italic">Peak Focus Window: 08:00 - 11:30</h4>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex gap-5 items-center group transition-all hover:bg-white/10">
                    <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                        <Box className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Recursive Protocol Check</div>
                        <h4 className="text-sm font-black text-white uppercase italic">7-Day Consistency: Stable (92%)</h4>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex gap-5 items-center group transition-all hover:bg-white/10">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Velocity Vector</div>
                        <h4 className="text-sm font-black text-white uppercase italic">+14% Growth vs Previous Cycle</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
