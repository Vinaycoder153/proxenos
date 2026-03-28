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
import { GET } from "@/app/api/discipline-score/route";

const mockUser = { id: "user-1" };

describe("GET /api/discipline-score", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(null));

    const resp = await GET();

    expect((resp as any).status).toBe(401);
  });

  it("returns score 0 with detail when user has no habits", async () => {
    const habitsChain = makeChain({ count: 0, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, habitsChain));

    const resp = await GET();

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toMatchObject({ score: 0, detail: "No habits defined" });
  });

  it("returns score 0 with detail when totalHabits is null", async () => {
    const habitsChain = makeChain({ count: null, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, habitsChain));

    const resp = await GET();

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toMatchObject({ score: 0 });
  });

  it("calculates and returns the correct score", async () => {
    const habitsChain = makeChain({ count: 5, error: null });
    const logsChain = makeChain({ count: 4, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, habitsChain, logsChain));

    const resp = await GET();

    expect((resp as any).status).toBe(200);
    // 4/5 = 80%
    expect((resp as any).body).toMatchObject({ score: 80, completed: 4, total: 5 });
  });

  it("returns a score of 100 when all habits are completed", async () => {
    const habitsChain = makeChain({ count: 3, error: null });
    const logsChain = makeChain({ count: 3, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, habitsChain, logsChain));

    const resp = await GET();

    expect((resp as any).body.score).toBe(100);
  });

  it("returns a score of 0 when no habits are completed", async () => {
    const habitsChain = makeChain({ count: 4, error: null });
    const logsChain = makeChain({ count: 0, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, habitsChain, logsChain));

    const resp = await GET();

    expect((resp as any).body.score).toBe(0);
  });

  it("returns 500 when habits query fails", async () => {
    const habitsChain = makeChain({ count: null, error: { message: "DB error" } });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, habitsChain));

    const resp = await GET();

    expect((resp as any).status).toBe(500);
    expect((resp as any).body).toMatchObject({ error: "DB error" });
  });

  it("returns 500 when habit_logs query fails", async () => {
    const habitsChain = makeChain({ count: 3, error: null });
    const logsChain = makeChain({ count: null, error: { message: "Logs error" } });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, habitsChain, logsChain));

    const resp = await GET();

    expect((resp as any).status).toBe(500);
    expect((resp as any).body).toMatchObject({ error: "Logs error" });
  });
});
