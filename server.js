import express from "express";
import indexRouter from "./routes/indexRouter.js";
import cardsRouter from "./routes/cardsRouter.js";
import connectToDB from "./config/db.js";

const PORT = process.env.PORT || 3001;
const app = express();

connectToDB();

app.use("/", indexRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
