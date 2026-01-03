import { GoogleGenerativeAI } from "@google/generative-ai";
import { Task, Habit, HabitLog } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Fallback for when API is unavailable or fails
const FALLBACK_RESPONSE = {
    score: 50,
    roast: "System offline. You got lucky. No analysis available, but I assume you're slacking.",
    directive: "MANUAL OVERRIDE: COMPLETE 1 HIGH PRIORITY TASK IMMEDIATELY.",
    analysis: "Data stream interrupted. Resume operations."
};

const getModel = () => genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateContent<T>(prompt: string, fallback: T): Promise<T> {
    if (!process.env.GEMINI_API_KEY) return fallback;

    try {
        const model = getModel();
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr) as T;
    } catch (error) {
        console.error("AI Generation Error:", error);
        return fallback;
    }
}

export async function generateAIFeedback(tasks: Task[], habits: Habit[], logs: HabitLog[]) {
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

    return generateContent(prompt, FALLBACK_RESPONSE);
}

export async function generateDailyPlan(tasks: Task[], habits: Habit[]) {
    const fallback = {
        schedule: [
            { time: "09:00", activity: "Deep Work Session 1", type: "work" } as const,
            { time: "11:00", activity: "Habit Stacking: " + (habits[0]?.title || "Hydration"), type: "habit" } as const,
            { time: "14:00", activity: "Admin & Low Energy Tasks", type: "work" } as const
        ],
        focus_score: 85,
        strategy: "Manual mode active. Stick to your baseline protocols."
    };

    const prompt = `
    ACT AS AN ELITE PRODUCTIVITY STRATEGIST (like a futuristic AI core).
    Draft a high-performance daily schedule based on the user's pending tasks and habits.
    
    DATA:
    - Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority, due: t.due_date })))}
    - Habits: ${JSON.stringify(habits.map(h => h.title))}
    
    RULES:
    1. Prioritize 'High' priority tasks for morning blocks.
    2. Interleave habits (e.g. morning routine, breaks).
    3. Use military time (e.g. "08:00").
    
    OUTPUT FORMAT (JSON ONLY, NO MARKDOWN):
    {
        "schedule": [
            { "time": "HH:MM", "activity": "<Short Description>", "type": "<work|habit|break>" }
        ],
        "focus_score": <0-100 prediction of today's potential>,
        "strategy": "<One sentence tactical advice for the day>"
    }
    `;

    return generateContent(prompt, fallback);
}

export async function analyzeHabitPatterns(data: { date: string; habit_id: string }[]) {
    const fallback = {
        trend: "Neutral",
        insight: "API offline. Manual review required.",
        recommendation: "Continue tracking your habits consistently."
    };

    const prompt = `
    Analyze the following habit tracking data and provide insights.
    
    DATA: ${JSON.stringify(data)}
    
    OUTPUT FORMAT (JSON ONLY, NO MARKDOWN):
    {
        "trend": "<Improving/Declining/Stable>",
        "insight": "<One sentence about their habit patterns>",
        "recommendation": "<Specific actionable advice>"
    }
    `;

    return generateContent(prompt, fallback);
}
