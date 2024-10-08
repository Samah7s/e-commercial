import request from "supertest";
import { app, Shutdown } from "../../src/index";

describe("server applicaiton", () => {
  afterAll((done) => {
    Shutdown(done);
  });
  it("Starts and has the proper test environment", async () => {
    expect(process.env.NODE_ENV).toBe("test");
    expect(app).toBeDefined();
  }, 10000);

  it("Returs all options allowed to be called by customers (http methods)", async () => {
    const response = await request(app).options("/");
    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-methods"]).toBe(
      "GET, POST, PUT,PATCH, DELETE"
    );
  });
});
