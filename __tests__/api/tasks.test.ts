import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeChain, makeAuthMock } from "./helpers";

// ---- module-level mocks ----
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
import { GET, POST, PATCH, DELETE } from "@/app/api/tasks/route";

const mockUser = { id: "user-1", email: "test@example.com" };

const sampleTask = {
  id: "t1",
  user_id: "user-1",
  title: "Test task",
  priority: "High",
  due_date: "2024-06-15",
  status: "pending",
  created_at: "2024-06-14T00:00:00Z",
};

function makeRequest(body?: unknown): Request {
  return {
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Request;
}

describe("GET /api/tasks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(null));

    const resp = await GET();

    expect((resp as any).status).toBe(401);
  });

  it("returns tasks on success", async () => {
    const updateChain = makeChain({ data: null, error: null });
    const selectChain = makeChain({ data: [sampleTask], error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, updateChain, selectChain));

    const resp = await GET();

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toEqual([sampleTask]);
  });

  it("returns 500 when the DB select fails", async () => {
    const updateChain = makeChain({ data: null, error: null });
    const selectChain = makeChain({ data: null, error: { message: "DB error" } });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, updateChain, selectChain));

    const resp = await GET();

    expect((resp as any).status).toBe(500);
    expect((resp as any).body).toMatchObject({ error: "DB error" });
  });
});

describe("POST /api/tasks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(null));

    const resp = await POST(makeRequest({ title: "Task", priority: "High", due_date: null }));

    expect((resp as any).status).toBe(401);
  });

  it("creates and returns a task", async () => {
    const insertChain = makeChain({ data: sampleTask, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, insertChain));

    const resp = await POST(makeRequest({ title: "Test task", priority: "High", due_date: null }));

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toEqual(sampleTask);
  });

  it("returns 500 when insert fails", async () => {
    const insertChain = makeChain({ data: null, error: { message: "Insert failed" } });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, insertChain));

    const resp = await POST(makeRequest({ title: "Task", priority: "Medium", due_date: null }));

    expect((resp as any).status).toBe(500);
    expect((resp as any).body).toMatchObject({ error: "Insert failed" });
  });
});

describe("PATCH /api/tasks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(null));

    const resp = await PATCH(makeRequest({ id: "t1", status: "completed" }));

    expect((resp as any).status).toBe(401);
  });

  it("returns 400 when id or status is missing", async () => {
    const chain = makeChain({ data: null, error: null });
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, chain));

    const resp = await PATCH(makeRequest({ id: "t1" }));

    expect((resp as any).status).toBe(400);
    expect((resp as any).body).toMatchObject({ error: "Missing id or status" });
  });

  it("returns 400 when both id and status are missing", async () => {
    const chain = makeChain({ data: null, error: null });
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, chain));

    const resp = await PATCH(makeRequest({}));

    expect((resp as any).status).toBe(400);
  });

  it("updates the task status and returns updated task", async () => {
    const updated = { ...sampleTask, status: "completed" };
    const updateChain = makeChain({ data: updated, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, updateChain));

    const resp = await PATCH(makeRequest({ id: "t1", status: "completed" }));

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toMatchObject({ status: "completed" });
  });

  it("returns 500 when update fails", async () => {
    const updateChain = makeChain({ data: null, error: { message: "Update failed" } });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, updateChain));

    const resp = await PATCH(makeRequest({ id: "t1", status: "missed" }));

    expect((resp as any).status).toBe(500);
  });
});

describe("DELETE /api/tasks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(null));

    const resp = await DELETE(makeRequest({ id: "t1" }));

    expect((resp as any).status).toBe(401);
  });

  it("returns 400 when id is missing", async () => {
    const chain = makeChain({ data: null, error: null });
    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, chain));

    const resp = await DELETE(makeRequest({}));

    expect((resp as any).status).toBe(400);
    expect((resp as any).body).toMatchObject({ error: "Missing task id" });
  });

  it("deletes the task and returns success", async () => {
    const deleteChain = makeChain({ data: null, error: null });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, deleteChain));

    const resp = await DELETE(makeRequest({ id: "t1" }));

    expect((resp as any).status).toBe(200);
    expect((resp as any).body).toMatchObject({ success: true });
  });

  it("returns 500 when delete fails", async () => {
    const deleteChain = makeChain({ data: null, error: { message: "Delete failed" } });

    (authenticateRequest as any).mockResolvedValue(makeAuthMock(mockUser, deleteChain));

    const resp = await DELETE(makeRequest({ id: "t1" }));

    expect((resp as any).status).toBe(500);
  });
});
