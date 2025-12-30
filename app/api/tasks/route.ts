import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Auto-mark missed tasks
    const today = new Date().toISOString().split('T')[0];
    await supabase
        .from("tasks")
        .update({ status: "missed" })
        .eq("user_id", user.id)
        .eq("status", "pending")
        .lt("due_date", today);

    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(tasks);
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { title, priority, due_date } = json;

    const { data, error } = await supabase
        .from("tasks")
        .insert({
            user_id: user.id,
            title,
            priority,
            due_date,
            status: "pending"
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function PATCH(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { id, status } = json;

    if (!id || !status) {
        return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
