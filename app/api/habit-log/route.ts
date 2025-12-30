import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { habit_id, date, completed } = json;
    // Expect 'completed': boolean. If true -> insert. If false -> delete.

    if (!habit_id || !date) {
        return NextResponse.json({ error: "Missing habit_id or date" }, { status: 400 });
    }

    if (completed) {
        const { data, error } = await supabase
            .from("habit_logs")
            .upsert({
                user_id: user.id,
                habit_id,
                completed_at: date
            }, { onConflict: 'user_id, habit_id, completed_at' })
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ status: "logged", data });
    } else {
        const { error } = await supabase
            .from("habit_logs")
            .delete()
            .eq("user_id", user.id)
            .eq("habit_id", habit_id)
            .eq("completed_at", date);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ status: "removed" });
    }
}
