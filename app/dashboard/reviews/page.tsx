"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { createClient } from "@/lib/supabase/client";
import { Review, HabitLog, Habit } from "@/lib/types";
import {
    Loader2,
    Save,
    Brain,
    Sparkles,
    History,
    TrendingUp,
    Activity,
    ShieldAlert,
    ChevronRight,
    MessageSquareQuote,
    BarChart
} from "lucide-react";
import { analyzeHabitPatterns } from "@/lib/ai";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export default function EnhancedReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState([7]);
    const [loading, setLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState<{ trend: string; insight: string; recommendation: string } | null>(null);
    const [isSyncing, setIsSyncing] = useState(true);
    const [chartData, setChartData] = useState<{ date: string; rating: number }[]>([]);

    const supabase = createClient();
    const { toast } = useToast();

    useEffect(() => {
        const loadInitialData = async () => {
            setIsSyncing(true);
            await Promise.all([fetchReviews(), fetchHabitStats()]);
            setIsSyncing(false);
        };
        loadInitialData();
    }, []);

    async function fetchReviews() {
        try {
            const res = await fetch("/api/reviews");
            if (res.ok) {
                const data = await res.json();
                setReviews(data);

                // Set chart data based on last 7 reviews
                const last7 = data.slice(0, 7).reverse();
                setChartData(last7.map((r: Review) => ({
                    date: new Date(r.date || "").toLocaleDateString('en-US', { weekday: 'short' }),
                    rating: r.rating || 0
                })));
            }
        } catch (error) {
            console.error("Fetch reviews error:", error);
        }
    }

    async function fetchHabitStats() {
        try {
            const [logsRes, habitsRes] = await Promise.all([
                supabase.from("habit_logs").select("*").order("completed_at", { ascending: false }).limit(100),
                supabase.from("habits").select("*")
            ]);

            if (logsRes.data && habitsRes.data) {
                const insights = await analyzeHabitPatterns(logsRes.data.map(l => ({
                    date: l.completed_at,
                    habit_id: l.habit_id
                })));
                setAiInsight(insights);
            }
        } catch (error) {
            console.error("Habit stats error:", error);
        }
    }

    async function submitReview() {
        if (!content.trim()) {
            toast({
                title: "Incomplete Signal",
                description: "Feedback buffer empty. Please provide reflection data.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                body: JSON.stringify({
                    content,
                    rating: rating[0],
                    date: new Date().toISOString().split('T')[0]
                })
            });

            if (res.ok) {
                const newReview = await res.json();
                setReviews([newReview, ...reviews]);
                setContent("");
                setRating([7]);

                toast({
                    title: "Signal Synchronized",
                    description: "Neural reflection data cached successfully.",
                    variant: "success",
                });

                fetchReviews(); // Refresh chart
                fetchHabitStats(); // Refresh AI
            }
        } catch (error) {
            toast({
                title: "Sync Error",
                description: "Failed to transmit neural reflection. System timeout.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const getRatingColor = (val: number) => {
        if (val >= 8) return "text-primary";
        if (val >= 5) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 p-4 md:p-8">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Brain className="h-5 w-5 text-primary" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/60">Neural Feedback Module</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
                        SYSTEM <span className="gradient-text">REVIEW</span>
                    </h1>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Cache daily reflection. Optimize biological performance.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <Activity className="h-5 w-5 text-primary animate-pulse" />
                    <div className="text-right">
                        <div className="text-[9px] font-mono text-muted-foreground uppercase">Memory Density</div>
                        <div className="text-sm font-black text-white">{reviews.length} SEGMENTS</div>
                    </div>
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-12">
                {/* Left Column: Log Entry & Chart */}
                <div className="lg:col-span-7 space-y-8">
                    <Card className="glass border-primary/20 bg-primary/5 shadow-[0_0_40px_rgba(var(--primary),0.02)] overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <MessageSquareQuote className="h-32 w-32 text-primary" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase text-white tracking-tight flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                Initialize Reflection
                            </CardTitle>
                            <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Input core metrics for current temporal cycle</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Productivity Vector (1 - 10)</label>
                                    <span className={cn("text-2xl font-black italic tracking-tighter", getRatingColor(rating[0]))}>
                                        {rating[0]}.0
                                    </span>
                                </div>
                                <Slider
                                    value={rating}
                                    onValueChange={setRating}
                                    max={10}
                                    min={1}
                                    step={1}
                                    className="py-4"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-1">Neural Narrative (Reflection)</label>
                                <Textarea
                                    placeholder="SYSTEM LOG: What operational upgrades occurred? What faults were detected?..."
                                    className="bg-black/60 border-white/5 focus:border-primary/40 rounded-2xl p-6 font-mono text-sm min-h-[160px]"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={submitReview}
                                disabled={loading}
                                className="w-full h-14 bg-primary text-black font-black uppercase tracking-[0.2em] hover:glow-active transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 mr-3" />
                                        Commit to Cache
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Historical Pulse Chart */}
                    <Card className="glass border-white/5 bg-black/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-mono uppercase tracking-[0.3em] flex items-center gap-2 text-muted-foreground">
                                <BarChart className="h-4 w-4" />
                                Efficiency Resonance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px] w-full mt-4">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <ReBarChart data={chartData}>
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{
                                                backgroundColor: '#000',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                fontSize: '10px'
                                            }}
                                        />
                                        <Bar dataKey="rating" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.rating >= 8 ? "hsl(var(--primary))" : entry.rating >= 5 ? "#eab308" : "#ef4444"} fillOpacity={0.4} />
                                            ))}
                                        </Bar>
                                    </ReBarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-[10px] font-mono text-muted-foreground/30 uppercase tracking-[0.2em]">Insufficient data for rendering pulse</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: AI Insights & History */}
                <div className="lg:col-span-5 space-y-8">
                    {/* AI Insight HUD */}
                    <Card className="glass border-primary/20 bg-black/40 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-mono uppercase tracking-[0.3em] flex items-center gap-2 text-primary">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                                Neural Signal Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isSyncing ? (
                                <div className="py-10 flex flex-col items-center gap-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
                                    <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest animate-pulse">Filtering Noise...</span>
                                </div>
                            ) : aiInsight ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="space-y-0.5">
                                            <span className="text-[8px] font-mono text-muted-foreground uppercase opacity-40">System Trend</span>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                                                <span className="text-sm font-black text-white uppercase italic">{aiInsight.trend}</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[8px] font-mono">Stable Link</Badge>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-xs font-mono text-muted-foreground leading-relaxed uppercase">
                                            {aiInsight.insight}
                                        </p>
                                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 relative group overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <ShieldAlert className="h-8 w-8 text-primary" />
                                            </div>
                                            <span className="text-[8px] font-mono text-primary uppercase tracking-[0.2em] block mb-2 font-black">CORE DIRECTIVE:</span>
                                            <p className="text-sm font-bold text-white relative z-10 italic">
                                                &quot;{aiInsight.recommendation}&quot;
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 text-center">
                                    <p className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">No analytic data available.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timeline / History */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.4em] flex items-center gap-3">
                            <History className="h-4 w-4" />
                            Signal History
                        </h3>
                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <div className="p-10 border border-dashed border-white/5 rounded-2xl text-center">
                                    <p className="text-[10px] font-mono text-muted-foreground/20 uppercase tracking-widest">Historical Cache Empty</p>
                                </div>
                            ) : (
                                reviews.slice(0, 5).map((review) => (
                                    <Card key={review.id} className="glass border-white/5 bg-white/5 transition-all hover:border-white/15 hover:bg-white/[0.07] group cursor-pointer overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary/40 transition-all" />
                                        <CardContent className="p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-[9px] font-mono text-muted-foreground/40 uppercase bg-white/5 px-2 py-1 rounded border border-white/5">
                                                        {review.date}
                                                    </div>
                                                </div>
                                                <div className={cn("text-lg font-black italic tracking-tighter", getRatingColor(review.rating || 0))}>
                                                    {review.rating || 0}.0
                                                </div>
                                            </div>
                                            <p className="text-xs text-foreground/70 font-mono line-clamp-2 italic leading-relaxed">
                                                &quot;{review.content}&quot;
                                            </p>
                                            <div className="mt-4 flex justify-end">
                                                <button className="text-[8px] font-mono text-primary/40 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all group-hover:text-primary">
                                                    Open Data Leaf <ChevronRight className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
