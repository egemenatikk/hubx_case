import { Author } from "../../models/index.js";
import { validateEditAuthor } from "../../validators/authorValidator.js";

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