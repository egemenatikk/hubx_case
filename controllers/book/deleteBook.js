import { Book } from "../../models/index.js";

export default async (req, res) => {
    try {
        // gets id parameter from request
        const bookId = req.params.id;

        // queries Book collection in database to get book document with given id
        const book = await Book.findById(bookId);

        // returns error message in response if there are no book documents in database with given id
        if (!book) {
            return res.status(404).json({ message: "There are no books with given ID" });
        }

        // deletes book document with given id from database
        await Book.findByIdAndDelete(bookId);

        // returns success message in response
        return res.status(200).json({ message: "Book is successfully deleted" });

    } catch (error) {
        // returns error message in response if any error occurs
        return res.status(500).json({ message: "Something went wrong" });
    }
}
