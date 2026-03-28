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
import { GET } from "@/app/api/habits/route";

const mockUser = { id: "user-1" };

const sampleHabits = [
  { id: "h1", user_id: "user-1", title: "Exercise", description: null, icon: "Dumbbell", created_at: "2024-01-01T00:00:00Z" },
  { id: "h2", user_id: "user-1", title: "Reading", description: null, icon: "Brain", created_at: "2024-01-02T00:00:00Z" },
];

describe("GET /api/habits", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(null));

    const resp = await GET();

    expect((resp as any).status).toBe(401);
  });

  it("returns the list of habits", async () => {
    const selectChain = makeChain({ data: sampleHabits, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, selectChain));

    const resp = await GET();

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toEqual(sampleHabits);
  });

  it("returns an empty array when no habits exist", async () => {
    const selectChain = makeChain({ data: [], error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, selectChain));

    const resp = await GET();

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toEqual([]);
  });

  it("returns 500 when the DB query fails", async () => {
    const selectChain = makeChain({ data: null, error: { message: "DB error" } });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, selectChain));

    const resp = await GET();

    expect((resp as any).status).toBe(500);
    expect((resp as any).body).toMatchObject({ error: "DB error" });
  });
});
