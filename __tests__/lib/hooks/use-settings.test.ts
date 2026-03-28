import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSettings } from "@/lib/hooks/use-settings";

describe("useSettings", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns default settings when localStorage is empty", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.settings).toEqual({
      noise: true,
      scanlines: false,
      glow: true,
      audio: true,
    });
  });

  it("loads persisted settings from localStorage on mount", () => {
    const saved = { noise: false, scanlines: true, glow: false, audio: false };
    localStorage.setItem("nexus_settings", JSON.stringify(saved));

    const { result } = renderHook(() => useSettings());

    expect(result.current.settings).toEqual(saved);
  });

  it("updates a single setting and persists it to localStorage", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ noise: false });
    });

    expect(result.current.settings.noise).toBe(false);

    const stored = JSON.parse(localStorage.getItem("nexus_settings")!);
    expect(stored.noise).toBe(false);
  });

  it("merges partial updates without overwriting other settings", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ scanlines: true });
    });

    expect(result.current.settings).toMatchObject({
      noise: true,
      scanlines: true,
      glow: true,
      audio: true,
    });
  });

  it("dispatches a custom event when settings are updated", () => {
    const { result } = renderHook(() => useSettings());
    const listener = vi.fn();
    window.addEventListener("nexus-settings-updated", listener);

    act(() => {
      result.current.updateSettings({ audio: false });
    });

    expect(listener).toHaveBeenCalledTimes(1);
    const eventDetail = (listener.mock.calls[0][0] as CustomEvent).detail;
    expect(eventDetail.audio).toBe(false);

    window.removeEventListener("nexus-settings-updated", listener);
  });

  it("reacts to nexus-settings-updated events dispatched externally", () => {
    const { result } = renderHook(() => useSettings());

    const newSettings = { noise: false, scanlines: true, glow: false, audio: false };

    act(() => {
      window.dispatchEvent(
        new CustomEvent("nexus-settings-updated", { detail: newSettings })
      );
    });

    expect(result.current.settings).toEqual(newSettings);
  });

  it("falls back to default settings when localStorage contains invalid JSON", () => {
    localStorage.setItem("nexus_settings", "{ invalid json }");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useSettings());

    expect(result.current.settings).toEqual({
      noise: true,
      scanlines: false,
      glow: true,
      audio: true,
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("removes the event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useSettings());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "nexus-settings-updated",
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });
});
