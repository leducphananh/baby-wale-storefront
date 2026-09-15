import { describe, expect, it } from "vitest";

import { extractTrackingToken, trackingFormSchema } from "./tracking";

describe("extractTrackingToken", () => {
  it("returns a raw token input unchanged (trimmed)", () => {
    expect(extractTrackingToken("  d0844301d4ddbdb8545e11ad4b7ba700dd730548a96d0677  ")).toBe(
      "d0844301d4ddbdb8545e11ad4b7ba700dd730548a96d0677",
    );
  });

  it("extracts the token from a full tracking URL", () => {
    const url = "https://babywale.vn/tra-cuu-don-hang?token=abc123def456";
    expect(extractTrackingToken(url)).toBe("abc123def456");
  });

  it("extracts the token from a URL with extra query params", () => {
    const url = "https://babywale.vn/tra-cuu-don-hang?utm_source=zalo&token=abc123";
    expect(extractTrackingToken(url)).toBe("abc123");
  });

  it("falls back to the raw input for a URL with no token param", () => {
    const url = "https://babywale.vn/tra-cuu-don-hang";
    // No `token` query param present — nothing to extract, so the raw
    // (URL-shaped) string is returned as-is; the RPC will simply not find
    // a match, the same "not found" outcome as any other bad input.
    expect(extractTrackingToken(url)).toBe(url);
  });

  it("returns an empty string for empty/whitespace-only input", () => {
    expect(extractTrackingToken("")).toBe("");
    expect(extractTrackingToken("   ")).toBe("");
  });
});

describe("trackingFormSchema", () => {
  it("rejects an empty submission with a Vietnamese message", () => {
    const result = trackingFormSchema.safeParse({ trackingInput: "  " });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Vui lòng nhập mã theo dõi hoặc dán liên kết theo dõi đơn hàng.",
    );
  });

  it("accepts any non-empty input (token or URL) — validated further server-side", () => {
    expect(trackingFormSchema.safeParse({ trackingInput: "abc123" }).success).toBe(true);
    expect(trackingFormSchema.safeParse({ trackingInput: "https://x.test/?token=abc" }).success).toBe(true);
  });
});
