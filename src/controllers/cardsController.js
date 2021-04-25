import mongoose from "mongoose";
import Card from "../models/cardModel.js";

export const getCards = async (req, res) => {
  const { userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json({ message: "Invalid user ID" });
  try {
    const cards = await Card.find({ userId });
    res.status(200).json(cards);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getCard = async (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId))
    return res.status(400).json({ message: "Invalid card ID" });
  try {
    const card = await Card.findById(cardId);
    res.status(200).json(card);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createCard = async (req, res) => {
  const { question, answer, categoryId, userId } = req.body;
  if (!question)
    return res.status(400).json({ message: "Question is required " });
  if (!answer) return res.status(400).json({ message: "Answer is required" });
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).json({ message: "Invalid category ID" });
  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json({ message: "Invalid user ID" });

  if (await Card.findOne({ question, categoryId }))
    return res.status(400).json({ message: "Card already exists" });
  const newCard = new Card({ question, answer, categoryId, userId });

  try {
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const updateCard = async (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId))
    return res.status(400).json({ message: "Invalid card ID" });

  const { question, answer, categoryId } = req.body;
  const updatedCard = {};
  if (question) updatedCard.question = question;
  if (answer) updatedCard.answer = answer;
  if (categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId))
      return res.status(400).json({ message: "Invalid category ID" });
    updatedCard.categoryId = categoryId;
  }

  try {
    await Card.findByIdAndUpdate(cardId, updatedCard);
    res.json(updatedCard);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId))
    return res.status(400).json({ message: "Invalid card ID" });

  await Card.findByIdAndRemove(cardId);
  res.json({ message: "Card successfully removed" });
};
