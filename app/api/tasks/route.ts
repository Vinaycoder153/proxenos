import { authenticateRequest } from "@/lib/api-auth";
import { getTodayDate } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    const { user, supabase, error } = await authenticateRequest();
    if (error) return error;

    // Auto-mark missed tasks
    await supabase
        .from("tasks")
        .update({ status: "missed" })
        .eq("user_id", user!.id)
        .eq("status", "pending")
        .lt("due_date", getTodayDate());

    const { data: tasks, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true });

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json(tasks);
}

export async function POST(request: Request) {
    const { user, supabase, error } = await authenticateRequest();
    if (error) return error;

    const json = await request.json();
    const { title, priority, due_date } = json;

    const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({
            user_id: user!.id,
            title,
            priority,
            due_date,
            status: "pending"
        })
        .select()
        .single();

    if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function PATCH(request: Request) {
    const { user, supabase, error } = await authenticateRequest();
    if (error) return error;

    const json = await request.json();
    const { id, status } = json;

    if (!id || !status) {
        return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const { data, error: updateError } = await supabase
        .from("tasks")
        .update({
            status,
            updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .eq("user_id", user!.id) // Security check
        .select()
        .single();

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const { user, supabase, error } = await authenticateRequest();
    if (error) return error;

    const json = await request.json();
    const { id } = json;

    if (!id) {
        return NextResponse.json({ error: "Missing task id" }, { status: 400 });
    }

    const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user!.id); // Security check

    if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

