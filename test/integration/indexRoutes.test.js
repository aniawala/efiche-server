import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("Index API", () => {
  describe("GET /api", () => {
    it("should return hello from api", async () => {
      const res = await chai.request(app).get("/api");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Hello from api!");
    });
  });
});
