import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    const cluster = process.env.MONGO_CLUSTER;

    const MONGO_URI = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    process.exit(1);
  }
};
