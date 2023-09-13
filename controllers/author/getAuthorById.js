import { Author } from "../../models/index.js";

export default async (req, res) => {
    try {
        const authorId = req.params.id;

        const author = await Author.findById(authorId);

        if (!author) {
            return res.status(404).json({ message: "There are no authors with given ID" });
        }

        return res.status(200).json({
            message: "Author is successfully fetched",
            author: author
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}