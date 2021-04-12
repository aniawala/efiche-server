import express from "express";
import {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/cardsController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getCards);
router.get("/:cardId", getCard);
router.post("/", createCard);
router.put("/:cardId", updateCard);
router.delete("/:cardId", deleteCard);

export default router;
