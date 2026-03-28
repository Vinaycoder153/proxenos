import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Supabase server client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock NextResponse to avoid Next.js server runtime requirements
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body: unknown, init?: ResponseInit) => ({
      body,
      status: init?.status ?? 200,
    })),
  },
}));

import { createClient } from "@/lib/supabase/server";
import { authenticateRequest } from "@/lib/api-auth";

describe("authenticateRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the authenticated user and supabase client when auth succeeds", async () => {
    const fakeUser = { id: "user-123", email: "test@example.com" };
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: fakeUser }, error: null }),
      },
    };

    (createClient as any).mockResolvedValue(fakeSupabase);

    const result = await authenticateRequest();

    expect(result.user).toEqual(fakeUser);
    expect(result.error).toBeNull();
    expect(result.supabase).toBe(fakeSupabase);
  });

  it("returns a 401 error response when no user is found", async () => {
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    };

    (createClient as any).mockResolvedValue(fakeSupabase);

    const result = await authenticateRequest();

    expect(result.user).toBeNull();
    expect(result.error).not.toBeNull();
    expect((result.error as any).status).toBe(401);
    expect((result.error as any).body).toMatchObject({ error: "Unauthorized" });
  });

  it("returns a 401 error response when auth returns an error", async () => {
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("Auth failure"),
        }),
      },
    };

    (createClient as any).mockResolvedValue(fakeSupabase);

    const result = await authenticateRequest();

    expect(result.user).toBeNull();
    expect(result.error).not.toBeNull();
    expect((result.error as any).status).toBe(401);
  });
});
