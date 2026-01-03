import { authenticateRequest } from "@/lib/api-auth";
import { getTodayDate } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    const { user, supabase, error } = await authenticateRequest();
    if (error) return error;

    // Get total active habits
    const { count: totalHabits, error: habitsError } = await supabase
        .from("habits")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user!.id);

    if (habitsError) {
        return NextResponse.json({ error: habitsError.message }, { status: 500 });
    }

    if (!totalHabits || totalHabits === 0) {
        return NextResponse.json({ score: 0, detail: "No habits defined" });
    }

    // Get completed habits for today
    const { count: completedToday, error: logsError } = await supabase
        .from("habit_logs")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user!.id)
        .eq("completed_at", getTodayDate());

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

