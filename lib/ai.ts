import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Fallback for when API is unavailable or fails
const FALLBACK_RESPONSE = {
    score: 50,
    roast: "System offline. You got lucky. No analysis available, but I assume you're slacking.",
    directive: "MANUAL OVERRIDE: COMPLETE 1 HIGH PRIORITY TASK IMMEDIATELY.",
    analysis: "Data stream interrupted. Resume operations."
};

export async function generateAIFeedback(tasks: any[], habits: any[], logs: any[]) {
    if (!process.env.GEMINI_API_KEY) {
        return FALLBACK_RESPONSE;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        ACT AS A RUTHLESS PRODUCTIVITY OFFICER. Your job is to analyze the user's performance and give STRICT, NO-FLUFF feedback.
        
        DATA:
        - Pending Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority, due: t.due_date })))}
        - Daily Habits: ${JSON.stringify(habits.map(h => h.title))}
        - Habits Completed Today: ${logs.length} out of ${habits.length}
        
        OUTPUT FORMAT (JSON ONLY, NO MARKDOWN):
        {
            "score": <0-100 integer based on completion rate and priority handling>,
            "roast": "<One short, punchy sentence criticizing their lack of discipline. Be harsh but motivating.>",
            "directive": "<ONE single, specific command to do RIGHT NOW. e.g. 'Complete Project X'.>",
            "analysis": "<One sentence clinical analysis of their current state.>"
        }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("AI Generation Error:", error);
        return FALLBACK_RESPONSE;
    }
}

export async function generateDailyPlan(tasks: any[], habits: any[]) {
    // Legacy support or future expansion
    return {
        mission: "Execute directives.",
        strategy: "Focus.",
        focus_areas: ["Execution"]
    };
}

