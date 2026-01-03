import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Centralized authentication helper for API routes
 * Returns authenticated user or error response
 */
export async function authenticateRequest() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            user: null,
            supabase,
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        };
    }

    return { user, supabase, error: null };
}
