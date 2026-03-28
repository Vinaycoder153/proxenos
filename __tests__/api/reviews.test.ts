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
import { GET, POST } from "@/app/api/reviews/route";

const mockUser = { id: "user-1" };

const sampleReview = {
  id: "r1",
  user_id: "user-1",
  date: "2024-06-15",
  content: "Good day",
  rating: 4,
  created_at: "2024-06-15T22:00:00Z",
};

function makeRequest(body: unknown): Request {
  return { json: vi.fn().mockResolvedValue(body) } as unknown as Request;
}

describe("GET /api/reviews", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(null));

    const resp = await GET();

    expect((resp as any).status).toBe(401);
  });

  it("returns the list of reviews", async () => {
    const selectChain = makeChain({ data: [sampleReview], error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, selectChain));

    const resp = await GET();

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toEqual([sampleReview]);
  });

  it("returns an empty array when no reviews exist", async () => {
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

describe("POST /api/reviews", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(null));

    const resp = await POST(makeRequest({ content: "Great day", rating: 5, date: "2024-06-15" }));

    expect((resp as any).status).toBe(401);
  });

  it("creates and returns a review", async () => {
    const insertChain = makeChain({ data: sampleReview, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, insertChain));

    const resp = await POST(makeRequest({ content: "Good day", rating: 4, date: "2024-06-15" }));

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toEqual(sampleReview);
  });

  it("uses today's date when date is not provided", async () => {
    const insertChain = makeChain({ data: sampleReview, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, insertChain));

    const resp = await POST(makeRequest({ content: "Good day", rating: 4 }));

    // Should succeed — date falls back to getTodayDate()
    expect((resp as any).status).toBe(200);
  });

  it("returns 500 when insert fails", async () => {
    const insertChain = makeChain({ data: null, error: { message: "Insert error" } });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, insertChain));

    const resp = await POST(makeRequest({ content: "Good day", rating: 4, date: "2024-06-15" }));

    expect((resp as any).status).toBe(500);
    expect((resp as any).body).toMatchObject({ error: "Insert error" });
  });
});
