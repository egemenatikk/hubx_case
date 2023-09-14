import { Book, Author } from "../../models/index.js";
import { validateCreateBook } from "../../validators/bookValidator.js";

export default async (req, res) => {
    try {

        // checks if given values in body are valid or not, if so returns error message in response 
        const { error } = validateCreateBook(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        // checks if a book document with same ISBN value already exists in database or not
        const bookExists = await Book.exists({ ISBN: req.body.ISBN });

        // if a book document with same ISBN value already exists in database, returns error message in response
        if (bookExists) {
            return res.status(409).json({ message: "There already exists a book with given ISBN code" });
        }

        // checks if an author document with given author id exists in database or not
        const authorExists = await Author.exists({ _id: req.body.author });

        // returns error message in response if an author document with given author id does not exist in database
        if (!authorExists) {
            return res.status(404).json({ message: "There are no authors with given author ID" });
        }

        // creates book object with given values in body
        let book = new Book({
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            ISBN: req.body.ISBN,
            language: req.body.language,
            numberOfPages: req.body.numberOfPages,
            publisher: req.body.publisher
        });

        // saves book object to database
        book = await book.save()

        // gets author document from Author collection using the author id value
        book = await Book.populate(book, { path: "author" });

        // returns success message and book object in response
        return res.status(201).json({ 
            message: "Book is successfully created",
            book: book
        });

    } catch (error) {
        // returns error message in response if any error occurs
        return res.status(500).json({ message: "Something went wrong" });
    }
}