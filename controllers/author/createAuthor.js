import { Author } from "../../models/index.js";
import { validateCreateAuthor } from "../../validators/authorValidator.js";

/**
 * @route POST /author
 * 
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The name of the author.
 * @param {string} req.body.country - The country of the author (optional).
 * @param {Date} req.body.birthDate - The birth date of the author (optional).
 * 
 * @description 
 *      This is the endpoint for creating an author document in Author collection. Firstly, it checks whether the values given in body are valid or
 *  not by using Joi validator. If there are any validation errors, it returns a JSON object containing error message with HTTP status code of 400.
 *  If there are no validation errors, it checks whether there is an author document with exact same values given in body. If so, it returns an 
 *  error message in response with HTTP status code of 409. If not, it creates the author object with given values and saves it to Author 
 *  collection. Lastly, it returns a JSON object containing success message and newly created author document in response with HTTP status code of
 *  201.
 * 
 *  If any error occurs during that process, it returns a JSON object containing error message with HTTP status code of 500.
 * 
 * @returns {string, Object} Success message, Author document
 * @returns {string} Error message
 */

export default async (req, res) => {
    try {

        // checks if given values in body are valid or not, if so returns error message in response
        const { error } = validateCreateAuthor(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        // checks if author with exact same values in body already exists or not
        const authorExists = await Author.exists({ 
            name: req.body.name,
            country: req.body.country,    
            birthDate: req.body.birthDate
        });

        // returns error message in response if an author with given values already exists in database
        if (authorExists) {
            return res.status(409).json({ message: "There already exists an author with exact same informations" });
        }

        // creates author object with given values in body
        let author = new Author({
            name: req.body.name,
            country: req.body.country,
            birthDate: req.body.birthDate
        });

        // saves author object to database
        author = await author.save();

        // returns success message and created author object in response
        return res.status(201).json({
            message: "Author is successfully created",
            author: author
        });

    } catch (error) {
        // returns error message in response if any error occurs
        return res.status(500).json({ message: "Something went wrong" });
    }
}