import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total active habits
    const { count: totalHabits, error: habitsError } = await supabase
        .from("habits")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

    if (habitsError) {
        return NextResponse.json({ error: habitsError.message }, { status: 500 });
    }

    if (!totalHabits || totalHabits === 0) {
        return NextResponse.json({ score: 0, detail: "No habits defined" });
    }

    // Get completed habits for today
    const today = new Date().toISOString().split('T')[0];
    const { count: completedToday, error: logsError } = await supabase
        .from("habit_logs")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("completed_at", today);

    if (logsError) {
        return NextResponse.json({ error: logsError.message }, { status: 500 });
    }

    const score = Math.round((completedToday! / totalHabits) * 100);

    return NextResponse.json({
        score,
        completed: completedToday,
        total: totalHabits
    });
}
