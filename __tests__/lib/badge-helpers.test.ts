import { describe, it, expect } from "vitest";
import {
  getPriorityBadgeVariant,
  getStatusBadgeVariant,
  getPriorityLabel,
  getStatusLabel,
} from "@/lib/badge-helpers";

describe("getPriorityBadgeVariant", () => {
  it("returns priority_high for High", () => {
    expect(getPriorityBadgeVariant("High")).toBe("priority_high");
  });

  it("returns priority_medium for Medium", () => {
    expect(getPriorityBadgeVariant("Medium")).toBe("priority_medium");
  });

  it("returns priority_low for Low", () => {
    expect(getPriorityBadgeVariant("Low")).toBe("priority_low");
  });

  it("defaults to priority_medium for unknown values", () => {
    expect(getPriorityBadgeVariant("Unknown" as any)).toBe("priority_medium");
  });
});

describe("getStatusBadgeVariant", () => {
  it("returns status_pending for pending", () => {
    expect(getStatusBadgeVariant("pending")).toBe("status_pending");
  });

  it("returns status_completed for completed", () => {
    expect(getStatusBadgeVariant("completed")).toBe("status_completed");
  });

  it("returns status_missed for missed", () => {
    expect(getStatusBadgeVariant("missed")).toBe("status_missed");
  });

  it("defaults to status_pending for unknown values", () => {
    expect(getStatusBadgeVariant("unknown" as any)).toBe("status_pending");
  });
});

describe("getPriorityLabel", () => {
  it("returns 'High Priority' for High", () => {
    expect(getPriorityLabel("High")).toBe("High Priority");
  });

  it("returns 'Medium Priority' for Medium", () => {
    expect(getPriorityLabel("Medium")).toBe("Medium Priority");
  });

  it("returns 'Low Priority' for Low", () => {
    expect(getPriorityLabel("Low")).toBe("Low Priority");
  });
});

describe("getStatusLabel", () => {
  it("capitalizes 'pending'", () => {
    expect(getStatusLabel("pending")).toBe("Pending");
  });

  it("capitalizes 'completed'", () => {
    expect(getStatusLabel("completed")).toBe("Completed");
  });

  it("capitalizes 'missed'", () => {
    expect(getStatusLabel("missed")).toBe("Missed");
  });
});
