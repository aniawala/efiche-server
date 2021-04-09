import mongoose from "mongoose";
import config from "config";

const db = config.get("mongoURI");

async function connectToDB() {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      returnOriginal: false,
    });
    console.log("Database connection established!");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

export default connectToDB;
