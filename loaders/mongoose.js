import mongoose from "mongoose";
import { dbUri } from "../config/index.js";

export default async () => {
    console.log("database url:", dbUri);

    await mongoose.connect(
        dbUri,
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