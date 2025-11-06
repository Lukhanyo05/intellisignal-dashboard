import { describe, it, expect } from "vitest";

describe("Basic Component Tests", () => {
  it("should pass basic math", () => {
    expect(1 + 1).toBe(2);
  });

  it("should work with arrays", () => {
    expect([1, 2, 3]).toHaveLength(3);
  });
});
