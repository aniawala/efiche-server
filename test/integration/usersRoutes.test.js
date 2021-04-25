import chai from "chai";
import chaiHttp from "chai-http";
import bcryptjs from "bcryptjs";
import app from "../../src/app.js";
import User from "../../src/models/userModel.js";
import { clearDb } from "./utils.js";

const { expect } = chai;
chai.use(chaiHttp);

const casesOfInvalidRegisterData = [
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
    issueDescription: "password length more than 255",
    userData: {
      username: "foobar",
      email: "foo@bar.com",
      password:
        "foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobar",
    },
  },
];

describe("Users API", () => {
  const registerRoute = "/api/users/register";
  const loginRoute = "/api/users/login";
  before(async () => {
    await clearDb();
  });
  afterEach(async () => {
    await clearDb();
  });
  describe(`POST ${registerRoute}`, () => {
    it("should register user if valid user data provided", async () => {
      const userData = {
        username: "foobar",
        email: "foo@bar.com",
        password: "foobar",
      };
      const res = await chai.request(app).post(registerRoute).send(userData);
      expect(res).to.have.status(201);
    });
    it("should not register user if username already exists", async () => {
      const userData = {
        username: "foobar",
        email: "foo@bar.com",
        password: "foobar",
      };
      const newUser = new User(userData);
      await newUser.save();
      const res = await chai.request(app).post(registerRoute).send(userData);
      expect(res).to.have.status(409);
    });
    it("should not register user if email already exists", async () => {
      let userData = {
        username: "foobar",
        email: "foo@bar.com",
        password: "foobar",
      };
      const newUser = new User(userData);
      await newUser.save();
      userData.username = "foobarfoo";
      const res = await chai.request(app).post(registerRoute).send(userData);
      expect(res).to.have.status(409);
    });
    casesOfInvalidRegisterData.forEach(({ issueDescription, userData }) => {
      it(`should not register user if ${issueDescription}`, async () => {
        const res = await chai.request(app).post(registerRoute).send(userData);
        expect(res).to.have.status(404);
      });
    });
  });
  describe(`POST ${loginRoute}`, () => {
    it("should return access token if valid user data provided", async () => {
      const username = "foobar";
      const email = "foo@bar.com";
      const password = "foobar";
      const hashedPassword = await bcryptjs.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      const res = await chai
        .request(app)
        .post(loginRoute)
        .send({ username, password });
      expect(res.body).to.haveOwnProperty("accessToken");
    });
    it("should not login if username not provided", async () => {
      const res = await chai
        .request(app)
        .post(loginRoute)
        .send({ password: "foobar" });
      expect(res).to.have.status(400);
    });
    it("should not login if password not provided", async () => {
      const res = await chai
        .request(app)
        .post(loginRoute)
        .send({ username: "foobar" });
      expect(res).to.have.status(400);
    });
    it("should not login if username not valid", async () => {
      const res = await chai
        .request(app)
        .post(loginRoute)
        .send({ username: "foobar", password: "foobar" });
      expect(res).to.have.status(400);
    });
    it("should not login if password not valid", async () => {
      const username = "foobar";
      const email = "foo@bar.com";
      const password = "foobar";
      const hashedPassword = await bcryptjs.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      const res = await chai
        .request(app)
        .post(loginRoute)
        .send({ username, password: "foobarfoobar" });
      expect(res).to.have.status(400);
    });
  });
});
