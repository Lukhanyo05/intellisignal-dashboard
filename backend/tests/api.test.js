const request = require("supertest");
const app = require("../index"); // Make sure to export app from index.js

describe("API Endpoints", () => {
  // Health check test
  it("should return health check message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
  });

  // GitHub user search test
  it("should return GitHub user data", async () => {
    const res = await request(app).get("/api/github/user/Lukhanyo05");
    expect([200, 404]).toContain(res.statusCode);
  });

  // GitLab user search test
  it("should return GitLab user data", async () => {
    const res = await request(app).get("/api/gitlab/search/lukhanyo");
    expect([200, 404]).toContain(res.statusCode);
  });
});
