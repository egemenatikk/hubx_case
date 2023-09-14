import mongoose from "mongoose";
import { dbUri, username, password } from "../config/index.js";

// connects to mongodb database
export default async () => {
    console.log("database url:", dbUri);

    await mongoose.connect(
        `mongodb://${username}:${password}@db:27017`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
        .then(() => {
            console.log("MongoDB connection is completed...");
        })
        .catch(err => {
            console.log(err);
        });
}