import { Author } from "../../models/index.js";

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