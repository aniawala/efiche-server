import mongoose from "mongoose";

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

export default connectToDatabase;
