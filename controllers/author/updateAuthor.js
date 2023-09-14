import { Author } from "../../models/index.js";
import { validateEditAuthor } from "../../validators/authorValidator.js";

/**
 * @route PUT /author/:id
 * 
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The name of the author (optional).
 * @param {string} [req.body.country] - The country of the author (optional).
 * @param {Date} [req.body.birthDate] - The birth date of the author (optional).
 * @param {string} req.params.id - The ID of the author.
 * 
 * @description 
 *      This is the endpoint for updating an author document from Author collection by id. Firstly, it calls Joi validator method to validate body 
 *  and checks whether values in body are valid or nor. If any validation error occurs, it returns a JSON object containing error message with HTTP 
 *  status code of 400. If not, it gets id parameter and checks whether there is an author in Author collection with given id. If not, it returns a
 *  JSON object containing error message with HTTP status code of 404. Then it checks whether there is an author document with exact same 
 *  information given in body. If there is already an author document with exact same information given in body, it checks whether that document is
 *  same as the document that is currently updated. If not, it returns a JSON object containing error message with HTTP status code of 409. If so,
 *  It returns a JSON object containing information message about document is not updated and author document without updating it with HTTP status
 *  code of 200. Then, it updates author document and saves it to Author collection. Finally, it returns a JSON object containing success message
 *  and updated author with HTTP status code of 200.
 * 
 *  If any error occurs during that process, it returns a JSON object containing error message with HTTP status code of 500.
 * 
 * @returns {string, Object} Success message, Author document
 * @returns {string} Error message
 */

export default async (req, res) => {
    try {

        // checks if given values in body are valid or not, if so returns error message in response
        const { error } = validateEditAuthor(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        // queries Author collection in database to get the author with given id 
        let author = await Author.findById(req.params.id);

        // returns error message in response if there are no authors in database with given id
        if (!author) {
            return res.status(404).json({ message: "There are no authors with given ID" })
        }

        // queries Author collection in database to get an author document with given values in body
        const sameInfoAuthor = await Author.findOne({ 
            name: req.body.name,
            country: req.body.country,    
            birthDate: req.body.birthDate
        });

        // checks if an author document with information exactly same with given values in body exists
        if (sameInfoAuthor) {

            // if the fetched author is not same as the author which is currently updated, returns error message in response
            if (sameInfoAuthor._id.toString() !== req.params.id) {
                return res.status(409).json({ message: "There already exists an author with the exact same information" });
            } else {
                // if the fetched author is same as the author which is currently updated, returns success, information message and author object
                // no update is performed
                return res.status(200).json({
                    message: "Author is not updated since the information given is the same as the information of the existing author",
                    author: author
                });
            }
        }

        // updates author object
        if (req.body.name) author.name = req.body.name;
        if (req.body.country) author.country = req.body.country;
        if (req.body.birthDate) author.birthDate = req.body.birthDate;

        // saves updated author object to database
        author = await author.save();

        // returns success message and updated author object in response
        return res.status(200).json({
            message: "Author is successfully updated",
            author: author
        });

    } catch (error) {
        // returns error message in response if any error occurs
        return res.status(500).json({ message: "Something went wrong" });
    }
}