import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ message: "Hello from api!" });
});

export default router;
