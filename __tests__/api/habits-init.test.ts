import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeChain, makeAuthMock } from "./helpers";

vi.mock("@/lib/api-auth", () => ({ authenticateRequest: vi.fn() }));
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body: unknown, init?: { status?: number }) => ({
      body,
      status: init?.status ?? 200,
    })),
  },
}));

import { authenticateRequest } from "@/lib/api-auth";
import { POST } from "@/app/api/habits/init/route";

const mockUser = { id: "user-1" };

const defaultHabitTitles = [
  "Learning",
  "Productive Work",
  "Physical Health",
  "Mind & Focus",
  "Sleep Discipline",
];

describe("POST /api/habits/init", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(null));

    const resp = await POST();

    expect((resp as any).status).toBe(401);
  });

  it("creates and returns the 5 default habits", async () => {
    const createdHabits = defaultHabitTitles.map((title, i) => ({
      id: `h${i}`,
      user_id: mockUser.id,
      title,
    }));

    const insertChain = makeChain({ data: createdHabits, error: null });
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, insertChain));

    const resp = await POST();

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toHaveLength(5);
    expect((resp as any).body.map((h: { title: string }) => h.title)).toEqual(defaultHabitTitles);
  });

  it("returns 500 when the insert fails", async () => {
    const insertChain = makeChain({ data: null, error: { message: "Insert error" } });
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, insertChain));

    const resp = await POST();

    expect((resp as any).status).toBe(500);
    expect((resp as any).body).toMatchObject({ error: "Insert error" });
  });
});
