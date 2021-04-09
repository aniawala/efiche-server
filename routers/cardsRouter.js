import express from "express";
import {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/cardsController.js";

const router = express.Router();

router.get("/", getCards);
router.get("/:id", getCard);
router.post("/", createCard);
router.patch("/:id", updateCard);
router.delete("/:id", deleteCard);

export default router;
