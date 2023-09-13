import { Author } from "../../models/index.js";
import { validateCreateAuthor } from "../../validators/authorValidator.js";

export default async (req, res) => {
    try {
        const { error } = validateCreateAuthor(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const authorExists = await Author.exists({ 
            name: req.body.name,
            country: req.body.country,    
            birthDate: req.body.birthDate
        });

        if (authorExists) {
            return res.status(409).json({ message: "There already exists an author with exact same informations" });
        }

        let author = new Author({
            name: req.body.name,
            country: req.body.country,
            birthDate: req.body.birthDate
        });

        author = await author.save();

        return res.status(201).json({
            message: "Author is successfully created",
            author: author
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}