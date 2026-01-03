import { authenticateRequest } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function POST() {
    const { user, supabase, error } = await authenticateRequest();
    if (error) return error;

    const defaultHabits = [
        { title: "Learning", description: "Read, course, or skill acquisition.", icon: "Brain" },
        { title: "Productive Work", description: "Deep work sessions (4h+).", icon: "Briefcase" },
        { title: "Physical Health", description: "Workout or activity.", icon: "Dumbbell" },
        { title: "Mind & Focus", description: "Meditation or blocked distractions.", icon: "Zap" },
        { title: "Sleep Discipline", description: "Bed before 11PM, 7h+ sleep.", icon: "Moon" },
    ];

    const { data, error: insertError } = await supabase
        .from("habits")
        .insert(defaultHabits.map(h => ({ ...h, user_id: user!.id })))
        .select();

    if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

