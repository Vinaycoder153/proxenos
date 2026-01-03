import { authenticateRequest } from "@/lib/api-auth";
import { getTodayDate } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    const { user, supabase, error } = await authenticateRequest();
    if (error) return error;

    const { data: reviews, error: fetchError } = await supabase
        .from("reviews")
        .select("*")
        .order("date", { ascending: false });

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json(reviews);
}

export async function POST(request: Request) {
    const { user, supabase, error } = await authenticateRequest();
    if (error) return error;

    const json = await request.json();
    const { content, rating, date } = json;

    const { data, error: insertError } = await supabase
        .from("reviews")
        .insert({
            user_id: user!.id,
            content,
            rating,
            date: date || getTodayDate()
        })
        .select()
        .single();

    if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

