import { Book } from "../../models/index.js";

export default async (req, res) => {
    try {
        // gets id parameter from request
        const bookId = req.params.id;

        // queries Book collection in database to get the book document with given id
        let book = await Book.findById(bookId);

        // if there are no book documents with given id in Book collection in database, returns error message in response
        if (!book) {
            return res.status(404).json({ message: "There are no books with given ID" });
        }

        // gets author document from Author collection using the author id value 
        book = await Book.populate(book, { path: "author" });

        // returns success message and fetched book document in response
        return res.status(200).json({ 
            message: "Book is successfully fetched",
            book: book
        });

    } catch (error) {
        // returns error message in response if any error occurs
        return res.status(500).json({ message: "Something went wrong" });
    }
}