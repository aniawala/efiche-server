import chai from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import auth from "../../src/middleware/authMiddleware.js";

const { expect } = chai;

describe("Auth middleware", () => {
  describe("#auth()", () => {
    let res;
    let next;
    beforeEach(() => {
      res = {
        status: sinon.stub().returns({ json: sinon.spy() }),
      };
      next = sinon.spy();
    });
    it("should authorize user if valid token provided", async () => {
      const user = { id: "1", username: "foobar" };
      const token = jwt.sign(user, process.env.JWT_SECRET);
      const req = {
        headers: { authorization: `Bearer ${token}` },
      };
      await auth(req, res, next);
      expect(next.calledOnce).to.be.true;
      expect(req.user.id).to.equal(user.id);
      expect(req.user.username).to.equal(user.username);
    });
    it("should not authorize user if no authorization header provided", async () => {
      const req = {
        headers: {},
      };
      await auth(req, res, next);
      expect(next.called).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(401)).to.be.true;
    });
    it("should not authorize user if token not valid", async () => {
      const invalidToken = "foobar";
      const req = {
        headers: {
          authorization: `Bearer ${invalidToken}`,
        },
      };
      await auth(req, res, next);
      expect(next.called).to.be.false;
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(400)).to.be.true;
    });
  });
});
