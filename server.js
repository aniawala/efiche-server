import express from "express";
import indexRouter from "./routers/indexRouter.js";
import categoriesRouter from "./routers/categoriesRouter.js";
import cardsRouter from "./routers/cardsRouter.js";
import connectToDB from "./config/db.js";

const PORT = process.env.PORT || 3001;
const app = express();

connectToDB();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/categories", categoriesRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
