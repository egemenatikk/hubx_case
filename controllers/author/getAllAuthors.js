import { Author } from "../../models/index.js";

export default async (req, res) => {
    try {
        const authors = await Author.find();
        
        return res.status(200).json({
            message: "All authors are successfully fetched",
            authors: authors
        });  

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}