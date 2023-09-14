import { Book } from "../../models/index.js";

export default async (req, res) => {
    try {
        const bookId = req.params.id;

        let book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "There are no books with given ID" });
        }

        book = await Book.populate(book, { path: "author" });

        return res.status(200).json({ 
            message: "Book is successfully fetched",
            book: book
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}