import mongoose from "mongoose";

async function connectToDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Database connection established!");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

export default connectToDB;
