import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const defaultHabits = [
        { title: "Learning", description: "Read, course, or skill acquisition.", icon: "Brain" },
        { title: "Productive Work", description: "Deep work sessions (4h+).", icon: "Briefcase" },
        { title: "Physical Health", description: "Workout or activity.", icon: "Dumbbell" },
        { title: "Mind & Focus", description: "Meditation or blocked distractions.", icon: "Zap" },
        { title: "Sleep Discipline", description: "Bed before 11PM, 7h+ sleep.", icon: "Moon" },
    ];

    const { data, error } = await supabase
        .from("habits")
        .insert(defaultHabits.map(h => ({ ...h, user_id: user.id })))
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
