import express from "express";
import mongoose from "mongoose";
import Category from "../models/categoryModel.js";
import Card from "../models/cardModel.js";

const router = express.Router();

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId);
    res.status(200).json(category);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  const newCategory = new Category({ name });

  try {
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(404).send(`Cannot find category with id ${categoryId}`);

  const updatedCategory = { name, _id: categoryId };
  await Category.findByIdAndUpdate(categoryId, updatedCategory);

  res.json(updatedCategory);
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(404).send(`Cannot find category with id ${categoryId}`);
  await Card.deleteMany({ categoryId: categoryId });
  await Category.findByIdAndRemove(categoryId);
  res.json({ message: "Category successfully removed" });
};

export const getCategoryCards = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const cards = await Card.find({ categoryId: categoryId });
    res.status(200).json(cards);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export default router;
