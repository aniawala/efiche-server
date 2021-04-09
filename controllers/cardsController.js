import express from "express";
import mongoose from "mongoose";

import Card from "../models/cardModel.js";

const router = express.Router();

export const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getCard = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findById(id);
    res.status(200).json(card);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createCard = async (req, res) => {
  const { question, answer, categoryId } = req.body;
  const newCard = new Card({ question, answer, categoryId });

  try {
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const updateCard = async (req, res) => {
  const { id } = req.params;
  const { question, answer, categoryId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`Cannot find card with id ${id}`);

  const updatedCard = { question, answer, categoryId, _id: id };
  await Card.findByIdAndUpdate(id, updatedCard);

  res.json(updatedCard);
};

export const deleteCard = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`Cannot find card with id ${id}`);

  await Card.findByIdAndRemove(id);
  res.json({ message: "Card successfully removed" });
};

export default router;
