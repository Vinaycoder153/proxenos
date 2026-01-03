import { createClient } from "@/lib/supabase/server";
import { Task, Habit, HabitLog } from "@/lib/types";
import { AnalyticsDashboard } from "@/components/dashboard/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const [tasksRes, habitsRes, logsRes] = await Promise.all([
        supabase.from("tasks").select("*").eq("user_id", user.id),
        supabase.from("habits").select("*").eq("user_id", user.id),
        supabase.from("habit_logs").select("*").eq("user_id", user.id)
    ]);

    const tasks = (tasksRes.data as Task[]) || [];
    const habits = (habitsRes.data as Habit[]) || [];
    const logs = (logsRes.data as HabitLog[]) || [];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight neon-text">Analytics Dashboard</h1>
                    <p className="text-muted-foreground font-mono text-sm">Deep insights into your productivity patterns</p>
                </div>
            </div>

            <AnalyticsDashboard tasks={tasks} habits={habits} logs={logs} />
        </div>
    );
}
