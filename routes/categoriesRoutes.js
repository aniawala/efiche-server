import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryCards,
} from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:categoryId", getCategory);
router.post("/", createCategory);
router.put("/:categoryId", updateCategory);
router.delete("/:categoryId", deleteCategory);
router.get("/:categoryId/cards", getCategoryCards);

export default router;
