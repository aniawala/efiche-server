import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app.js";
import Card from "../../src/models/cardModel.js";
import {
  clearDb,
  createUserSession,
  createTestCard,
  createTestCategory,
} from "./utils.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("Cards API", () => {
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
  describe("GET /api/cards", () => {
    it("should return cards for given user id", async () => {
      const cardId = await createTestCard({ userId });
      const res = await chai
        .request(app)
        .get("/api/cards")
        .set("Authorization", `Bearer ${token}`)
        .send({ userId });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0]._id).to.equal(cardId.toString());
      expect(res.body.length).to.equal(1);
    });
    it("should return empty array if no cards for given user id", async () => {
      const res = await chai
        .request(app)
        .get("/api/cards")
        .set("Authorization", `Bearer ${token}`)
        .send({ userId });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });
    it("should not return cards if user id not valid", async () => {
      const invalidUserId = "foobar";
      const res = await chai
        .request(app)
        .get("/api/cards")
        .set("Authorization", `Bearer ${token}`)
        .send({ invalidUserId });
      expect(res).to.have.status(400);
    });
  });
  describe("GET /api/cards/cardId", () => {
    it("should return card for given card id", async () => {
      const cardId = await createTestCard({ userId });

      const res = await chai
        .request(app)
        .get(`/api/cards/${cardId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body._id).to.equal(cardId.toString());
    });
    it("should not return card if card id not valid", async () => {
      const invalidCardId = "foobar";

      const res = await chai
        .request(app)
        .get(`/api/cards/${invalidCardId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(400);
    });
  });
  describe("POST /api/cards", () => {
    it("should create new card if all data provided", async () => {
      const question = "foo";
      const answer = "bar";
      const categoryId = await createTestCategory({ userId });

      const res = await chai
        .request(app)
        .post("/api/cards")
        .set("Authorization", `Bearer ${token}`)
        .send({ question, answer, categoryId, userId });
      expect(res).to.have.status(201);
    });
    it("should not create new card if question not provided", async () => {
      const question = "foo";
      const answer = "bar";
      const categoryId = await createTestCategory({ userId });

      const res = await chai
        .request(app)
        .post("/api/cards")
        .set("Authorization", `Bearer ${token}`)
        .send({ answer, categoryId, userId });
      expect(res).to.have.status(400);
    });
    it("should not create new card if answer not provided", async () => {
      const question = "foo";
      const answer = "bar";
      const categoryId = await createTestCategory({ userId });

      const res = await chai
        .request(app)
        .post("/api/cards")
        .set("Authorization", `Bearer ${token}`)
        .send({ question, categoryId, userId });
      expect(res).to.have.status(400);
    });
    it("should not create new card if category id not valid", async () => {
      const question = "foo";
      const answer = "bar";
      const invalidCategoryId = "foobar";

      const res = await chai
        .request(app)
        .post("/api/cards")
        .set("Authorization", `Bearer ${token}`)
        .send({ question, answer, invalidCategoryId, userId });
      expect(res).to.have.status(400);
    });
    it("should not create new card if user id not valid", async () => {
      const question = "foo";
      const answer = "bar";
      const categoryId = await createTestCategory({ userId });
      const invalidUserId = "foobar";

      const res = await chai
        .request(app)
        .post("/api/cards")
        .set("Authorization", `Bearer ${token}`)
        .send({ question, answer, categoryId, invalidUserId });
      expect(res).to.have.status(400);
    });
    it("should not create new card if card with given question in given category already exists", async () => {
      const question = "foo";
      const answer = "bar";
      const categoryId = await createTestCategory({ userId });
      await createTestCard({ question, categoryId, userId });

      const res = await chai
        .request(app)
        .post("/api/cards")
        .set("Authorization", `Bearer ${token}`)
        .send({ question, answer, categoryId, userId });
      expect(res).to.have.status(400);
    });
  });
  describe("PUT /api/cards/cardId", () => {
    it("should update card with provided data", async () => {
      const cardId = await createTestCard({ userId });
      const newQuestion = "foobar";
      const newAnswer = "barfoo";
      const newCategoryId = await createTestCategory({ name: "new", userId });
      const res = await chai
        .request(app)
        .put(`/api/cards/${cardId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          question: newQuestion,
          answer: newAnswer,
          categoryId: newCategoryId,
        });
      expect(res).to.have.status(200);
      const updatedCard = await Card.findById(cardId);
      expect(updatedCard.question).to.deep.equal(newQuestion);
      expect(updatedCard.answer).to.deep.equal(newAnswer);
      expect(updatedCard.categoryId).to.deep.equal(newCategoryId);
    });
    it("should not update card if card id not valid", async () => {
      const invalidCardId = "foobar";

      const res = await chai
        .request(app)
        .put(`/api/cards/${invalidCardId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(400);
    });
    it("should not update card category if category id not valid", async () => {
      const cardId = await createTestCard({ userId });
      const invalidCategoryId = "foobar";

      const res = await chai
        .request(app)
        .put(`/api/cards/${cardId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          categoryId: invalidCategoryId,
        });
      expect(res).to.have.status(400);
    });
  });
  describe("DELETE /api/cards/cardId", () => {
    it("should delete card with given card id", async () => {
      const cardId = await createTestCard({ userId });

      const res = await chai
        .request(app)
        .delete(`/api/cards/${cardId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      const card = await Card.findById(cardId);
      expect(card).to.be.null;
    });
    it("should not delete card with card id not valid", async () => {
      const invalidCardId = "foobar";

      const res = await chai
        .request(app)
        .delete(`/api/cards/${invalidCardId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(400);
    });
  });
});
