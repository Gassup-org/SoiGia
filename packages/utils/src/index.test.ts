import { describe, expect, it } from "vitest";
import { formatCurrency } from "./index";

describe("formatCurrency", () => {
  it("formats VND values for display", () => {
    expect(formatCurrency(12500)).toBe("12.500 đ");
  });
});
