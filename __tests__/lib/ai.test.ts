import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Task, Habit, HabitLog } from "@/lib/types";

// Hoist the mock fn so it can be referenced inside vi.mock() and in tests
const mockGenerateContent = vi.hoisted(() => vi.fn());

vi.mock("@google/generative-ai", () => {
  const MockGoogleGenerativeAI = function (this: unknown) {
    (this as any).getGenerativeModel = () => ({
      generateContent: mockGenerateContent,
    });
  };
  return { GoogleGenerativeAI: MockGoogleGenerativeAI };
});

import { generateAIFeedback, generateDailyPlan, analyzeHabitPatterns } from "@/lib/ai";

const sampleTasks: Task[] = [
  {
    id: "task-1",
    user_id: "user-1",
    title: "Build feature X",
    priority: "High",
    due_date: "2024-06-15",
    status: "pending",
    created_at: "2024-06-14T00:00:00Z",
  },
];

const sampleHabits: Habit[] = [
  {
    id: "habit-1",
    user_id: "user-1",
    title: "Exercise",
    description: "30 min workout",
    icon: "Dumbbell",
    created_at: "2024-01-01T00:00:00Z",
  },
];

const sampleLogs: HabitLog[] = [
  {
    id: "log-1",
    user_id: "user-1",
    habit_id: "habit-1",
    completed_at: "2024-06-15",
  },
];

describe("generateAIFeedback", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns the fallback response when GEMINI_API_KEY is not set", async () => {
    delete process.env.GEMINI_API_KEY;

    const result = await generateAIFeedback(sampleTasks, sampleHabits, sampleLogs);

    expect(result).toMatchObject({
      score: 50,
      roast: expect.any(String),
      directive: expect.any(String),
      analysis: expect.any(String),
    });
    // The generate function should not have been called
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it("returns AI-generated content when API call succeeds", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    const aiResponse = {
      score: 75,
      roast: "You are barely functional.",
      directive: "Complete task X now.",
      analysis: "Performance is sub-optimal.",
    };

    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify(aiResponse) },
    });

    const result = await generateAIFeedback(sampleTasks, sampleHabits, sampleLogs);

    expect(mockGenerateContent).toHaveBeenCalledOnce();
    expect(result).toMatchObject({
      score: 75,
      roast: "You are barely functional.",
    });
  });

  it("returns fallback when the API call throws", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    mockGenerateContent.mockRejectedValue(new Error("API error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await generateAIFeedback(sampleTasks, sampleHabits, sampleLogs);

    expect(result).toMatchObject({ score: 50, roast: expect.any(String) });
    consoleSpy.mockRestore();
  });

  it("returns fallback when the API returns invalid JSON", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    mockGenerateContent.mockResolvedValue({
      response: { text: () => "not valid json{{{" },
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await generateAIFeedback(sampleTasks, sampleHabits, sampleLogs);

    expect(result).toMatchObject({ score: 50 });
    consoleSpy.mockRestore();
  });
});

describe("generateDailyPlan", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns fallback plan when GEMINI_API_KEY is not set", async () => {
    delete process.env.GEMINI_API_KEY;

    const result = await generateDailyPlan(sampleTasks, sampleHabits);

    expect(result).toMatchObject({
      schedule: expect.arrayContaining([
        expect.objectContaining({ time: expect.any(String), activity: expect.any(String) }),
      ]),
      focus_score: expect.any(Number),
      strategy: expect.any(String),
    });
  });

  it("includes the first habit title in fallback schedule when habits are provided", async () => {
    delete process.env.GEMINI_API_KEY;

    const result = await generateDailyPlan(sampleTasks, sampleHabits);

    const activities = result.schedule.map((s) => s.activity);
    expect(activities.some((a) => a.includes("Exercise"))).toBe(true);
  });

  it("uses 'Hydration' in fallback schedule when no habits are provided", async () => {
    delete process.env.GEMINI_API_KEY;

    const result = await generateDailyPlan(sampleTasks, []);

    const activities = result.schedule.map((s) => s.activity);
    expect(activities.some((a) => a.includes("Hydration"))).toBe(true);
  });

  it("returns AI-generated plan when API call succeeds", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    const aiPlan = {
      schedule: [{ time: "09:00", activity: "Deep work", type: "work" }],
      focus_score: 90,
      strategy: "Focus on high-priority items.",
    };

    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify(aiPlan) },
    });

    const result = await generateDailyPlan(sampleTasks, sampleHabits);

    expect(result).toMatchObject({ focus_score: 90, strategy: "Focus on high-priority items." });
  });
});

describe("analyzeHabitPatterns", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns fallback analysis when GEMINI_API_KEY is not set", async () => {
    delete process.env.GEMINI_API_KEY;

    const data = [{ date: "2024-06-15", habit_id: "habit-1" }];
    const result = await analyzeHabitPatterns(data);

    expect(result).toMatchObject({
      trend: "Neutral",
      insight: expect.any(String),
      recommendation: expect.any(String),
    });
  });

  it("accepts an empty data array and returns fallback", async () => {
    delete process.env.GEMINI_API_KEY;

    const result = await analyzeHabitPatterns([]);

    expect(result).toMatchObject({
      trend: expect.any(String),
      insight: expect.any(String),
      recommendation: expect.any(String),
    });
  });

  it("returns AI-generated analysis when API call succeeds", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    const aiAnalysis = {
      trend: "Improving",
      insight: "Habits are on the rise.",
      recommendation: "Keep consistent.",
    };

    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify(aiAnalysis) },
    });

    const data = [{ date: "2024-06-15", habit_id: "habit-1" }];
    const result = await analyzeHabitPatterns(data);

    expect(result).toMatchObject({ trend: "Improving" });
  });
});
