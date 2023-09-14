import { Book } from "../../models/index.js";

/**
 * @route DELETE /book/:id
 * 
 * @param {string} req.params.id - The ID of the author.
 * 
 * @description 
 *      This is the endpoint for deleting a book document from Book collection. Firstly, it takes id parameter and checks whether a book document
 *  with that id exists in Book collection or not. If not, it returns a JSON object containing error message with HTTP status code of 404. If book
 *  with given id exists, it then deletes it from Book collection. Lastly, it returns a JSON object containing success message with HTTP status
 *  code of 200.
 * 
 *  If any error occurs during that process, it returns a JSON object containing error message with HTTP status code of 500.
 * 
 * @returns {string} Error/success message
 */

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
