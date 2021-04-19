import mongoose from "mongoose";
import Category from "../models/categoryModel.js";
import Card from "../models/cardModel.js";

export const getCategories = async (req, res) => {
  const { userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json({ message: "Invalid user ID" });
  try {
    const categories = await Category.find({ userId });
    res.status(200).json(categories);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getCategory = async (req, res) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).json({ message: "Invalid category ID" });
  try {
    const category = await Category.findById(categoryId);
    res.status(200).json(category);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  const { name, userId } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required " });
  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json({ message: "Invalid user ID" });

  if (await Category.findOne({ name }))
    return res.status(400).json({ message: "Category already exists" });

  const newCategory = new Category({ name, userId });

  try {
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).json({ message: "Invalid category ID" });

  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  if (await Category.findOne({ name }))
    return res.status(400).json({ message: "Category already exists" });
  const updatedCategory = { name, _id: categoryId };
  await Category.findByIdAndUpdate(categoryId, updatedCategory);

  res.json(updatedCategory);
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).json({ message: "Invalid category ID" });

  await Card.deleteMany({ categoryId });
  await Category.findByIdAndRemove(categoryId);
  res.json({ message: "Category successfully removed" });
};

export const getCategoryCards = async (req, res) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).json({ message: "Invalid category ID" });
  try {
    const cards = await Card.find({ categoryId });
    res.status(200).json(cards);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
