import { Book, Author } from "../../models/index.js";
import { validateCreateBook } from "../../validators/bookValidator.js";

/**
 * @route POST /book
 * 
 * @param {Object} req.body - The request body.
 * @param {string} req.body.title - The title of the book.
 * @param {Object} req.body.author - The author of the book.
 * @param {string} req.body.ISBN - The ISBN code of the book.
 * @param {number} req.body.price - The price of the book (optional).
 * @param {string} req.body.language - The language of the book (optional).
 * @param {number} req.body.numberOfPages - The number of pages in the book (optional).
 * @param {string} req.body.publisher - The publisher of the book (optional).
 * 
 * @description 
 *      This is the endpoint for creating a book document in Book collection. Firstly, it calls Joi validator function to check whether values in 
 *  body are valid or not. If any validation error occurs, it returns a JSON object containing error message with HTTP status code of 400. If there
 *  are not any validation errors, it checks whether a book document with given ISBN value already exists in Book collection or not. If so, it 
 *  returns a JSON object containing error message with HTTP status code of 409. If not, it continues by checking whether an author in Author
 *  collection with given id in author field in body exists. If not, it returns a JSON object containing error message with HTTP status code of 404.
 *  If the author exists, it creates book document and saves it to Book collection. Then, it gets author document from Author collection using the 
 *  author id value in author field of body. Finally, it returns a JSON object containing success message and created book document with HTTP status
 *  code of 201.
 * 
 *  If any error occurs during that process, it returns a JSON object containing error message with HTTP status code of 500.
 * 
 * @returns {string, Object} Success message, Book document
 * @returns {string} Error message
 */

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