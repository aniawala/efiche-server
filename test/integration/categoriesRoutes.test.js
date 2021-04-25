import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app.js";
import Card from "../../src/models/cardModel.js";
import Category from "../../src/models/categoryModel.js";
import {
  clearDb,
  createUserSession,
  createTestCategory,
  createTestCard,
} from "./utils.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("Categories API", () => {
  let userId, token;
  before(async () => {
    await clearDb();
  });
  beforeEach(async () => {
    const sessionData = await createUserSession();
    userId = sessionData.userId;
    token = sessionData.token;
  });
  afterEach(async () => {
    await clearDb();
  });
  describe("GET /api/categories", () => {
    it("should return categories for given user id", async () => {
      const categoryId = await createTestCategory({ userId });

      const res = await chai
        .request(app)
        .get("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ userId });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0]._id).to.equal(categoryId.toString());
      expect(res.body.length).to.equal(1);
    });
    it("should return empty array if no categories for given user id", async () => {
      const res = await chai
        .request(app)
        .get("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ userId });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });
    it("should not return categories if user id not provided", async () => {
      const res = await chai
        .request(app)
        .get("/api/categories")
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(400);
    });
    it("should not return categories if user id not valid", async () => {
      const invalidUserId = "foobar";

      const res = await chai
        .request(app)
        .get("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ userId: invalidUserId });
      expect(res).to.have.status(400);
    });
  });
  describe("GET /api/categories/categoryId", () => {
    it("should return category with given category id", async () => {
      const categoryId = await createTestCategory({ userId });
      const res = await chai
        .request(app)
        .get(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body._id).to.equal(categoryId.toString());
    });
    it("should not return category if category id not valid", async () => {
      const invalidCategoryId = "foobar";
      const res = await chai
        .request(app)
        .get(`/api/categories/${invalidCategoryId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(400);
    });
  });
  describe("POST /api/categories", () => {
    it("should create new category if all data provided", async () => {
      const name = "foo";

      const res = await chai
        .request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ name, userId });
      expect(res).to.have.status(201);
    });
    it("should not create new category if user id not provided", async () => {
      const name = "foo";

      const res = await chai
        .request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ name });
      expect(res).to.have.status(400);
    });
    it("should not create new category if user id not valid", async () => {
      const name = "foo";
      const invalidUserId = "foobar";

      const res = await chai
        .request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ name, userId: invalidUserId });
      expect(res).to.have.status(400);
    });
    it("should not create new category if name not provided", async () => {
      const res = await chai
        .request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ userId });
      expect(res).to.have.status(400);
    });
    it("should not create new category if name already exists", async () => {
      const name = "foo";
      await createTestCategory({ name, userId });

      const res = await chai
        .request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ name, userId });
      expect(res).to.have.status(400);
    });
  });
  describe("PUT /api/categories/categoryId", () => {
    it("should update category if all data provided", async () => {
      const categoryId = await createTestCategory({ name: "foo", userId });
      const newName = "foobar";

      const res = await chai
        .request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: newName });
      expect(res).to.have.status(200);

      const updatedCategory = await Category.findById(categoryId);
      expect(updatedCategory.name).to.equal(newName);
    });
    it("should not update category if category id not valid", async () => {
      const invalidCategoryId = "foobar";
      const newName = "foobar";

      const res = await chai
        .request(app)
        .put(`/api/categories/${invalidCategoryId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: newName });
      expect(res).to.have.status(400);
    });
    it("should not update category if new name already exists", async () => {
      const name = "foo";
      const categoryId = await createTestCategory({ name, userId });

      const res = await chai
        .request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name });
      expect(res).to.have.status(400);
    });
  });
  describe("DELETE /api/categories/categoryId", () => {
    it("should delete category with given category id", async () => {
      const categoryId = await createTestCategory({ userId });

      const res = await chai
        .request(app)
        .delete(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      const category = await Category.findById(categoryId);
      expect(category).to.be.null;
    });
    it("should delete category and its card with given category id", async () => {
      const categoryId = await createTestCategory({ userId });
      const cardId = await createTestCard({ categoryId, userId });

      const res = await chai
        .request(app)
        .delete(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      const card = await Card.findById(cardId);
      expect(card).to.be.null;
    });
    it("should not delete category if category id not valid", async () => {
      const invalidCategoryId = "foobar";

      const res = await chai
        .request(app)
        .delete(`/api/categories/${invalidCategoryId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(400);
    });
  });
  describe("GET /api/categories/categoryId/cards", () => {
    it("should return cards for category with given category id", async () => {
      const categoryId = await createTestCategory({ userId });
      const cardId = await createTestCard({ categoryId, userId });

      const res = await chai
        .request(app)
        .get(`/api/categories/${categoryId}/cards`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0]._id).to.equal(cardId.toString());
      expect(res.body.length).to.equal(1);
    });
    it("should return empty array if no cards for category with given category id", async () => {
      const categoryId = await createTestCategory({ userId });

      const res = await chai
        .request(app)
        .get(`/api/categories/${categoryId}/cards`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });
    it("should not return cards for category if category id not valid", async () => {
      const invalidCategoryId = "foobar";

      const res = await chai
        .request(app)
        .get(`/api/categories/${invalidCategoryId}/cards`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(400);
    });
  });
});
