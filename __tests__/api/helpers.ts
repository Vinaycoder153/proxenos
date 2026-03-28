import { vi } from "vitest";

/**
 * Creates a chainable Supabase query mock that resolves with the provided result.
 * Every builder method (select, eq, lt, etc.) returns the same chain so it can
 * be fluently chained.  Awaiting the chain yields `result`.
 */
export function makeChain(result: { data?: unknown; error?: unknown; count?: number | null }) {
  type Chain = Record<string, unknown> & { then: (cb: (v: typeof result) => unknown) => Promise<unknown> };

  const chain: Chain = {
    ...result,
    then(onFulfilled: (v: typeof result) => unknown) {
      return Promise.resolve(result).then(onFulfilled);
    },
  };

  const methods = ["select", "insert", "update", "delete", "upsert", "eq", "lt", "order", "single"];
  for (const name of methods) {
    chain[name] = vi.fn(() => chain);
  }

  return chain;
}

/**
 * Creates a mock authenticated request context that mirrors what
 * `authenticateRequest()` returns.  Pass an array of `fromResults` to control
 * what successive `supabase.from()` calls return.
 */
export function makeAuthMock(
  user: { id: string; email?: string } | null,
  ...fromResults: ReturnType<typeof makeChain>[]
) {
  const supabase = { from: vi.fn() };
  for (const result of fromResults) {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValueOnce(result);
  }
  // Default fallback for any additional calls
  (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(makeChain({ data: null, error: null }));

  if (user) {
    return { user, supabase, error: null };
  }
  return {
    user: null,
    supabase,
    error: { body: { error: "Unauthorized" }, status: 401 },
  };
}
