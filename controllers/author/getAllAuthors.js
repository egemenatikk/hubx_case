import { Author } from "../../models/index.js";

/**
 * @route GET /author
 * 
 * @description 
 *      This is the endpoint for getting all author documents from Author collection. It queries Author collection for all author documents. Then,
 *  it returns a JSON object containing success message and a list of author documents with HTTP status code of 200.
 * 
 *  If any error occurs during that process, it returns a JSON object containing error message with HTTP status code of 500.
 * 
 * @returns {string, Object[]} Success message, Author documents list
 * @returns {string} Error message
 */

export default async (req, res) => {
    try {
        // gets list of all author objects from database
        const authors = await Author.find();
        
        // returns success message and list of all author objects in response
        return res.status(200).json({
            message: "All authors are successfully fetched",
            authors: authors
        });  

    } catch (error) {
        // returns error message in response if any error occurs
        return res.status(500).json({ message: "Something went wrong" });
    }
}