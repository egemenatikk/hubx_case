import { Author } from "../../models/index.js";

/**
 * @route GET /author/:id
 * 
 * @param {string} req.params.id - The ID of the author.
 * 
 * @description 
 *      This is the endpoint for getting author document from Author collection by id. Firstly, it gets id parameter and checks whether there is 
 *  an author in Author collection with given id. If not, it returns a JSON object containing error message with HTTP status code of 404. If there
 *  is an author with given id, it returns a JSON object containing success message and author document with HTTP status code of 200.
 * 
 *  If any error occurs during that process, it returns a JSON object containing error message with HTTP status code of 500.
 * 
 * @returns {string, Object} Success message, Author document
 * @returns {string} Error message
 */

export default async (req, res) => {
    try {
        // gets id parameter from request 
        const authorId = req.params.id;

        // queries Author collection in database to get the author with given id
        const author = await Author.findById(authorId);

        // returns error message in response if there are no authors in database with given id
        if (!author) {
            return res.status(404).json({ message: "There are no authors with given ID" });
        }

        // returns success message and author in response
        return res.status(200).json({
            message: "Author is successfully fetched",
            author: author
        });

    } catch (error) {
        // returns error message in response if any error occurs
        return res.status(500).json({ message: "Something went wrong" });
    }
}