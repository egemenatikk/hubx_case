import mongoose from "mongoose";
import { dbUri, username, password, nodeEnvironment } from "../config/index.js";

// Define MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Function to create the MongoDB connection URI based on the environment
function getMongoDBUri(nodeEnv) {
  const baseUri = `mongodb://${username}:${password}@`;
  if (nodeEnvironment === "test") {
    return `${baseUri}db-test:27017`;
  } else {
    return `${baseUri}db-production:27017`;
  }
}

// Connect to the appropriate MongoDB database based on the environment
export default async () => {
  const dbConnectionUri = getMongoDBUri(nodeEnvironment);

  try {
    await mongoose.connect(dbConnectionUri, mongooseOptions);
    console.log(`Connected to MongoDB: ${dbConnectionUri}`);
  } catch (error) {
    console.error("Database connection error:", error);
  }

  mongoose.connection.on("disconnected", () => {
    console.log("Database connection is disconnected.");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("Mongoose disconnected on app termination");
      process.exit(0);
    });
  });
}