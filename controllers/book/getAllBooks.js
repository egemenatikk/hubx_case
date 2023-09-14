import { Book } from "../../models/index.js";

/**
 * @route GET /book
 * 
 * @description 
 *      This is the endpoint for getting all book documents from Book collection. It queries Book collection for all book documents. It also gets 
 *  author documents for corresponding book documents from Author collection. Then, it returns a JSON object containing success message and a list
 *  of book documents with HTTP status code of 200.
 * 
 *  If any error occurs during that process, it returns a JSON object containing error message with HTTP status code of 500.
 * 
 * @returns {string, Object[]} Success message, Book documents list
 * @returns {string} Error message
 */

export default async (req, res) => {
    try {
        // gets list of all book documents in Book collection in database
        const books = await Book.find().populate("author");
        
        // returns success message and list of all book documents in response
        return res.status(200).json({
            message: "All books are successfully fetched",
            books: books
        });

    } catch (error) {
        // returns error message in response if any error occurs
        return res.status(500).json({ message: "Something went wrong" });
    }
}