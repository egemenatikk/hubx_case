import { Author } from "../../models/index.js";

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