import mongoose from "mongoose";
import { dbUri } from "../config/index.js";

// connects to mongodb database
export default async () => {
    console.log("database url:", dbUri);

    await mongoose.connect(
        "mongodb://root:example@db:27017",
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