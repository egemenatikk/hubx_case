import { Author } from "../../models/index.js";
import { validateEditAuthor } from "../../validators/authorValidator.js";

export default async (req, res) => {
    try {
        const { error } = validateEditAuthor(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        let author = await Author.findById(req.params.id);

        if (!author) {
            return res.status(404).json({ message: "There are no authors with given ID" })
        }

        const sameInfoAuthor = await Author.findOne({ 
            name: req.body.name,
            country: req.body.country,    
            birthDate: req.body.birthDate
        });

        if (sameInfoAuthor) {

            if (sameInfoAuthor._id.toString() !== req.params.id) {
                return res.status(409).json({ message: "There already exists an author with the exact same information" });
            } else {
                return res.status(200).json({
                    message: "Author is not updated since the information given is the same as the information of the existing author",
                    author: author
                });
            }
        }

        if (req.body.name) author.name = req.body.name;
        if (req.body.country) author.country = req.body.country;
        if (req.body.birthDate) author.birthDate = req.body.birthDate;

        author = await author.save();

        return res.status(200).json({
            message: "Author is successfully updated",
            author: author
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}