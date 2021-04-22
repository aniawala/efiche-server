// import chai from "chai";
// import sinon from "sinon";
// import { registerUser } from "../../controllers/usersController.js";

// const { expect } = chai;
// const casesOfInvalidRegisterData = [
//   {
//     issueDescription: "username not provided",
//     userData: { email: "foo@bar.com", password: "foobar" },
//   },
//   {
//     issueDescription: "empty username",
//     userData: { username: "", email: "foo@bar.com", password: "foobar" },
//   },
//   {
//     issueDescription: "username contains non alphanumeric character",
//     userData: {
//       username: "foo_bar",
//       email: "foo@bar.com",
//       password: "foobar",
//     },
//   },
//   {
//     issueDescription: "username length less than 4",
//     userData: {
//       username: "foo",
//       email: "foo@bar.com",
//       password: "foobar",
//     },
//   },
//   {
//     issueDescription: "username length more than 30",
//     userData: {
//       username: "foobarfoobarfoobarfoobarfoobarfoo",
//       email: "foo@bar.com",
//       password: "foobar",
//     },
//   },
//   {
//     issueDescription: "email not provided",
//     userData: { username: "foobar", password: "foobar" },
//   },
//   {
//     issueDescription: "empty email",
//     userData: { username: "foobar", email: "", password: "foobar" },
//   },
//   {
//     issueDescription: "email not valid",
//     userData: { username: "foobar", email: "foobar", password: "foobar" },
//   },
//   {
//     issueDescription: "password not provided",
//     userData: { username: "foobar", email: "foo@bar.com" },
//   },
//   {
//     issueDescription: "empty password",
//     userData: { username: "foobar", email: "foo@bar.com", password: "" },
//   },
//   {
//     issueDescription: "password length less than 6",
//     userData: { username: "foobar", email: "foo@bar.com", password: "foo" },
//   },
//   {
//     issueDescription: "password length more than 50",
//     userData: {
//       username: "foobar",
//       email: "foo@bar.com",
//       password: "foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoo",
//     },
//   },
// ];

// describe("Users controller", () => {
//   describe("#registerUser()", () => {
//     let res;
//     beforeEach(function () {
//       res = {
//         status: sinon.stub().returns({ json: sinon.spy() }),
//       };
//     });
//     casesOfInvalidRegisterData.forEach(({ issueDescription, userData }) => {
//       it(`should not register user if ${issueDescription}`, async () => {
//         const req = { body: userData };
//         await registerUser(req, res);
//         expect(res.status.calledOnce).to.be.true;
//         expect(res.status.calledWith(404)).to.be.true;
//       });
//     });
//     // it("should register user if all user data valid", async () => {
//     //   const req = {
//     //     body: { username: "foobar", email: "foo@bar.com", password: "foobar" },
//     //   };
//     //   await registerUser(req, res);
//     //   expect(res.status.calledOnce).to.be.true;
//     //   expect(res.status.calledWith(201)).to.be.true;
//     // });
//     // it("should not register user if username already exists", () => {});
//     // it("should not register user if email already exists", () => {});
//   });
// });
