import { Book } from "../../models/index.js";

export default async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}