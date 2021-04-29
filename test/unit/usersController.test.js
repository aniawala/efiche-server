import chai from "chai";
import sinon from "sinon";
import { signupUser } from "../../src/controllers/usersController.js";

const { expect } = chai;
const casesOfInvalidSignupData = [
  {
    issueDescription: "username not provided",
    userData: { email: "foo@bar.com", password: "foobar" },
  },
  {
    issueDescription: "empty username",
    userData: { username: "", email: "foo@bar.com", password: "foobar" },
  },
  {
    issueDescription: "username contains non alphanumeric character",
    userData: {
      username: "foo_bar",
      email: "foo@bar.com",
      password: "foobar",
    },
  },
  {
    issueDescription: "username length less than 4",
    userData: {
      username: "foo",
      email: "foo@bar.com",
      password: "foobar",
    },
  },
  {
    issueDescription: "username length more than 30",
    userData: {
      username: "foobarfoobarfoobarfoobarfoobarfoo",
      email: "foo@bar.com",
      password: "foobar",
    },
  },
  {
    issueDescription: "email not provided",
    userData: { username: "foobar", password: "foobar" },
  },
  {
    issueDescription: "empty email",
    userData: { username: "foobar", email: "", password: "foobar" },
  },
  {
    issueDescription: "email not valid",
    userData: { username: "foobar", email: "foobar", password: "foobar" },
  },
  {
    issueDescription: "password not provided",
    userData: { username: "foobar", email: "foo@bar.com" },
  },
  {
    issueDescription: "empty password",
    userData: { username: "foobar", email: "foo@bar.com", password: "" },
  },
  {
    issueDescription: "password length less than 6",
    userData: { username: "foobar", email: "foo@bar.com", password: "foo" },
  },
  {
    issueDescription: "password length more than 50",
    userData: {
      username: "foobar",
      email: "foo@bar.com",
      password:
        "foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobar",
    },
  },
];

describe("Users controller", () => {
  describe("#signupUser()", () => {
    let res;
    beforeEach(() => {
      res = {
        status: sinon.stub().returns({ json: sinon.spy() }),
      };
    });
    it("should signup user if all user data valid", async () => {
      const req = {
        body: { username: "foobar", email: "foo@bar.com", password: "foobar" },
      };
      await signupUser(req, res);
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
    });
    casesOfInvalidSignupData.forEach(({ issueDescription, userData }) => {
      it(`should not signup user if ${issueDescription}`, async () => {
        const req = { body: userData };
        await signupUser(req, res);
        expect(res.status.calledOnce).to.be.true;
        expect(res.status.calledWith(404)).to.be.true;
      });
    });
    // it("should not signup user if username already exists", () => {});
    // it("should not signup user if email already exists", () => {});
  });
});
