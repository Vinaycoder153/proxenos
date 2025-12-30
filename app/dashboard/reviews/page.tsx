"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { createClient } from "@/lib/supabase/client";
import { Review } from "@/lib/types";
import { Loader2, Save } from "lucide-react";
import { analyzeHabitPatterns } from "@/lib/ai";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState([5]);
    const [loading, setLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState<any>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchReviews();
        loadAiInsights();
    }, []);

    async function fetchReviews() {
        const res = await fetch("/api/reviews");
        if (res.ok) {
            const data = await res.json();
            setReviews(data);
        }
    }

    async function loadAiInsights() {
        // Mock calling AI with recent data
        const insights = await analyzeHabitPatterns([]);
        setAiInsight(insights);
    }

    async function submitReview() {
        if (!content) return;
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
                setRating([5]);
            }
        } catch (error) {
            console.error("Failed to submit review", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Review</h1>
                <p className="text-muted-foreground">Log your daily progress and receive AI feedback.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/20 bg-card/40">
                    <CardHeader>
                        <CardTitle>Daily Log</CardTitle>
                        <CardDescription>Reflect on your performance today.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Productivity Rating (1-10)</label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={rating}
                                    onValueChange={setRating}
                                    max={10}
                                    step={1}
                                    className="flex-1"
                                />
                                <span className="w-8 text-center font-bold text-primary">{rating[0]}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Reflection</label>
                            <Textarea
                                placeholder="What went well? What needs improvement?"
                                className="min-h-[150px] bg-background/50"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <Button onClick={submitReview} disabled={loading} className="w-full">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Log
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-primary neon-text flex items-center gap-2">
                                AI Insight
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {aiInsight ? (
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-semibold text-foreground">Trend:</span> {aiInsight.trend}</p>
                                    <p className="text-muted-foreground">{aiInsight.insight}</p>
                                    <div className="mt-4 p-3 rounded bg-primary/10 border border-primary/20 text-primary">
                                        <span className="font-bold block mb-1">Recommendation:</span>
                                        {aiInsight.recommendation}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center p-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Past Logs</h3>
                        {reviews.map((review) => (
                            <Card key={review.id} className="bg-card/20">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">{review.date}</span>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
                                            {review.rating}/10
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/90">{review.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
