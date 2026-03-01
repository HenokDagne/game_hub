import { describe, expect, it } from "vitest";
import { clearCache, getCached, setCached } from "@/lib/cache";

describe("cache", () => {
  it("returns cached value before expiry", () => {
    clearCache();
    setCached("foo", { ok: true }, 1000);

    expect(getCached<{ ok: boolean }>("foo")).toEqual({ ok: true });
  });

  it("returns null for unknown key", () => {
    clearCache();

    expect(getCached("missing")).toBeNull();
  });
});
