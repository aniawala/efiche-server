import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app.js";
import Card from "../../src/models/cardModel.js";
import User from "../../src/models/userModel.js";
import Category from "../../src/models/categoryModel.js";

chai.use(chaiHttp);

export const clearDb = async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Card.deleteMany({});
};

export const createUserSession = async () => {
  const userData = {
    username: "foobar",
    email: "foo@bar.com",
    password: "foobar",
  };
  const signupRes = await chai
    .request(app)
    .post("/api/users/signup")
    .send(userData);
  const userId = signupRes.body._id;
  const loginRes = await chai
    .request(app)
    .post("/api/users/login")
    .send({ username: userData.username, password: userData.password });
  const token = loginRes.body.accessToken;
  return { userId, token };
};

export const createTestCategory = async ({ name = "foo", userId }) => {
  const newCategory = new Category({ name, userId });
  await newCategory.save();
  return newCategory._id;
};

export const createTestCard = async ({
  question = "foo",
  answer = "bar",
  categoryId,
  userId,
}) => {
  if (!categoryId) {
    categoryId = await createTestCategory({ userId });
  }
  const newCard = new Card({ question, answer, categoryId, userId });
  await newCard.save();
  return newCard._id;
};
