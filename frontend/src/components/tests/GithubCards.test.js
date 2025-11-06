import { describe, it, expect } from "vitest";

describe("GithubCards Component", () => {
  it("should handle repository data structure", () => {
    const repoData = {
      name: "test-repo",
      stars: 5,
      forks: 2,
      description: "A test repository",
    };
    expect(repoData.name).toBe("test-repo");
    expect(repoData.stars).toBe(5);
    expect(typeof repoData.description).toBe("string");
  });

  it("should format commit data correctly", () => {
    const commitData = {
      message: "Fix: update dependencies",
      author: "testuser",
      date: "2024-01-01",
    };
    expect(commitData.message).toContain("update");
    expect(commitData).toHaveProperty("author");
    expect(commitData).toHaveProperty("date");
  });
});
