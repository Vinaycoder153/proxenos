import { authenticateRequest } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const { user, supabase, error } = await authenticateRequest();
    if (error) return error;

    const { data: habits, error: fetchError } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: true });

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json(habits);
}

