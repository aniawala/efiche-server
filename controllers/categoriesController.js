import express from "express";
import mongoose from "mongoose";

import Category from "../models/categoryModel";

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
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
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
  const { id } = req.params;
  const { name, cardsVolume } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`Cannot find category with id ${id}`);

  const updatedCategory = { name, cardsVolume, _id: id };
  await Category.findByIdAndUpdate(id, updatedCategory);

  res.json(updatedCategory);
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`Cannot find category with id ${id}`);

  await Category.findByIdAndRemove(id);
  res.json({ message: "Category successfully removed" });
};

export default router;
