import { Book } from "../../models/index.js";

/**
 * @route GET /book/:id
 * 
 * @param {string} req.params.id - The ID of the book.
 * 
 * @description 
 *      This is the endpoint for getting a book document from Book collection by id. Firstly, it gets id parameter and checks whether there is 
 *  a book in Book collection with given id. If not, it returns a JSON object containing error message with HTTP status code of 404. If there
 *  is a book document with given id, it also gets the corresponding author document by using author id in author field of book document. Lastly, 
 *  it returns a JSON object containing success message and book document with HTTP status code of 200.
 * 
 *  If any error occurs during that process, it returns a JSON object containing error message with HTTP status code of 500.
 * 
 * @returns {string, Object} Success message, Book document
 * @returns {string} Error message
 */

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