import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { cn, getPriorityStyles, getTodayDate, formatDateToISO } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates conflicting tailwind classes", () => {
    expect(cn("text-red-400", "text-blue-400")).toBe("text-blue-400");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("handles undefined and null values", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });

  it("returns empty string for no input", () => {
    expect(cn()).toBe("");
  });
});

describe("getPriorityStyles", () => {
  it("returns red styles for High priority", () => {
    const styles = getPriorityStyles("High");
    expect(styles).toContain("text-red-400");
    expect(styles).toContain("border-red-500/30");
    expect(styles).toContain("bg-red-500/5");
  });

  it("returns yellow styles for Medium priority", () => {
    const styles = getPriorityStyles("Medium");
    expect(styles).toContain("text-yellow-400");
    expect(styles).toContain("border-yellow-500/30");
    expect(styles).toContain("bg-yellow-500/5");
  });

  it("returns green styles for Low priority", () => {
    const styles = getPriorityStyles("Low");
    expect(styles).toContain("text-green-400");
    expect(styles).toContain("border-green-500/30");
    expect(styles).toContain("bg-green-500/5");
  });

  it("returns muted styles for unknown priority value", () => {
    // Cast to bypass TS so we can test the default branch
    const styles = getPriorityStyles("Unknown" as any);
    expect(styles).toContain("text-muted-foreground");
    expect(styles).toContain("border-white/10");
    expect(styles).toContain("bg-white/5");
  });
});

describe("getTodayDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a date string in YYYY-MM-DD format", () => {
    const result = getTodayDate();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns the current UTC date", () => {
    vi.setSystemTime(new Date("2024-06-15T10:30:00.000Z"));
    expect(getTodayDate()).toBe("2024-06-15");
  });

  it("correctly handles year/month/day boundaries", () => {
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
    expect(getTodayDate()).toBe("2025-01-01");
  });
});

describe("formatDateToISO", () => {
  it("formats a Date object to YYYY-MM-DD", () => {
    const date = new Date("2024-03-28T00:00:00.000Z");
    expect(formatDateToISO(date)).toBe("2024-03-28");
  });

  it("returns only the date portion, ignoring time", () => {
    const date = new Date("2024-12-31T23:59:59.999Z");
    expect(formatDateToISO(date)).toBe("2024-12-31");
  });

  it("handles leap day", () => {
    const date = new Date("2024-02-29T12:00:00.000Z");
    expect(formatDateToISO(date)).toBe("2024-02-29");
  });
});
