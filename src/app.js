import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import indexRoutes from "./routes/indexRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import cardsRoutes from "./routes/cardsRoutes.js";
import connectToDatabase from "./db/db.js";
import auth from "./middleware/authMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

connectToDatabase();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", indexRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/categories", auth, categoriesRoutes);
app.use("/api/cards", auth, cardsRoutes);

mongoose.connection.once("open", function () {
  console.log("Database connection established!");
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
});

export default app;
