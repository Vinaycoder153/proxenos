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
import { POST } from "@/app/api/habit-log/route";

const mockUser = { id: "user-1" };

function makeRequest(body: unknown): Request {
  return { json: vi.fn().mockResolvedValue(body) } as unknown as Request;
}

describe("POST /api/habit-log", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(null));

    const resp = await POST(makeRequest({ habit_id: "h1", date: "2024-06-15", completed: true }));

    expect((resp as any).status).toBe(401);
  });

  it("returns 400 when habit_id is missing", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser));

    const resp = await POST(makeRequest({ date: "2024-06-15", completed: true }));

    expect((resp as any).status).toBe(400);
    expect((resp as any).body).toMatchObject({ error: "Missing habit_id or date" });
  });

  it("returns 400 when date is missing", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser));

    const resp = await POST(makeRequest({ habit_id: "h1", completed: true }));

    expect((resp as any).status).toBe(400);
  });

  it("upserts a habit log when completed is true", async () => {
    const logRecord = { id: "log-1", user_id: "user-1", habit_id: "h1", completed_at: "2024-06-15" };
    const upsertChain = makeChain({ data: logRecord, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, upsertChain));

    const resp = await POST(makeRequest({ habit_id: "h1", date: "2024-06-15", completed: true }));

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toMatchObject({ status: "logged", data: logRecord });
  });

  it("returns 500 when upsert fails", async () => {
    const upsertChain = makeChain({ data: null, error: { message: "Upsert error" } });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, upsertChain));

    const resp = await POST(makeRequest({ habit_id: "h1", date: "2024-06-15", completed: true }));

    expect((resp as any).status).toBe(500);
    expect((resp as any).body).toMatchObject({ error: "Upsert error" });
  });

  it("deletes a habit log when completed is false", async () => {
    const deleteChain = makeChain({ data: null, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, deleteChain));

    const resp = await POST(makeRequest({ habit_id: "h1", date: "2024-06-15", completed: false }));

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toMatchObject({ status: "removed" });
  });

  it("returns 500 when delete fails", async () => {
    const deleteChain = makeChain({ data: null, error: { message: "Delete error" } });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, deleteChain));

    const resp = await POST(makeRequest({ habit_id: "h1", date: "2024-06-15", completed: false }));

    expect((resp as any).status).toBe(500);
    expect((resp as any).body).toMatchObject({ error: "Delete error" });
  });
});
