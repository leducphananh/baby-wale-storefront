import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns 200 with exactly { status: 'ok' }", async () => {
    const res = GET();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ status: "ok" });
  });

  it("does not leak env values or internals in the body", async () => {
    const body = await GET().json();
    expect(Object.keys(body)).toEqual(["status"]);
  });
});
