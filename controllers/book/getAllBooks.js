import { Book } from "../../models/index.js";

export default async (req, res) => {
    try {
        const books = await Book.find().populate("author");
        
        return res.status(200).json({
            message: "All books are successfully fetched",
            books: books
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}