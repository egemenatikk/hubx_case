import { Book } from "../../models/index.js";

export default async (req, res) => {
    try {
        // gets list of all book documents in Book collection in database
        const books = await Book.find().populate("author");
        
        // returns success message and list of all book documents in response
        return res.status(200).json({
            message: "All books are successfully fetched",
            books: books
        });

    } catch (error) {
        // returns error message in response if any error occurs
        return res.status(500).json({ message: "Something went wrong" });
    }
}