import Card from "../models/cardModel.js";

export const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
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
  const { cardId } = req.params;
  const { question, answer, categoryId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(cardId))
    return res.status(404).send(`Cannot find card with id ${cardId}`);

  const updatedCard = { question, answer, categoryId, _id: cardId };
  await Card.findByIdAndUpdate(cardId, updatedCard);

  res.json(updatedCard);
};

export const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId))
    return res.status(404).send(`Cannot find card with id ${cardId}`);

  await Card.findByIdAndRemove(cardId);
  res.json({ message: "Card successfully removed" });
};
