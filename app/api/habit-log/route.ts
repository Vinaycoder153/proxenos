import { authenticateRequest } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { user, supabase, error } = await authenticateRequest();
    if (error) return error;

    const json = await request.json();
    const { habit_id, date, completed } = json;
    // Expect 'completed': boolean. If true -> insert. If false -> delete.

    if (!habit_id || !date) {
        return NextResponse.json({ error: "Missing habit_id or date" }, { status: 400 });
    }

    if (completed) {
        const { data, error: upsertError } = await supabase
            .from("habit_logs")
            .upsert({
                user_id: user!.id,
                habit_id,
                completed_at: date
            }, { onConflict: 'user_id, habit_id, completed_at' })
            .select()
            .single();

        if (upsertError) return NextResponse.json({ error: upsertError.message }, { status: 500 });
        return NextResponse.json({ status: "logged", data });
    } else {
        const { error: deleteError } = await supabase
            .from("habit_logs")
            .delete()
            .eq("user_id", user!.id)
            .eq("habit_id", habit_id)
            .eq("completed_at", date);

        if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
        return NextResponse.json({ status: "removed" });
    }
}

