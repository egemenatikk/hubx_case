import { Book } from "../../models/index.js";

export default async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "There are no books with given ID" });
        }

        return res.status(200).json({ 
            message: "Book is successfully fetched",
            book: book
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}