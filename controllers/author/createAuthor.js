import { Author } from "../../models/index.js";
import { validateCreateAuthor } from "../../validators/authorValidator.js";

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