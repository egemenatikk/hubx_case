import { Book, Author } from "../../models/index.js";
import { validateEditBook } from "../../validators/bookValidator.js";

/**
 * @route PUT /book/:id
 * 
 * @param {Object} req.body - The request body.
 * @param {string} req.body.title - The title of the book (optional).
 * @param {Object} req.body.author - The author of the book (optional).
 * @param {string} req.body.ISBN - The ISBN code of the book (optional).
 * @param {number} req.body.price - The price of the book (optional).
 * @param {string} req.body.language - The language of the book (optional).
 * @param {number} req.body.numberOfPages - The number of pages in the book (optional).
 * @param {string} req.body.publisher - The publisher of the book (optional).
 * @param {string} req.params.id - The ID of the book.
 * 
 * @description 
 *      This is the endpoint for updating a book document in Book collection. Firstly, it calls Joi validator function to check whether values in 
 *  body are valid or not. If any validation error occurs, it returns a JSON object containing error message with HTTP status code of 400. If there
 *  are not any validation errors, it checks whether a book document with given id exists or not. If not, it returns a JSON object containing error
 *  message with HTTP status code of 404. If a book with given ID exists, it checks whether ISBN value is given in body or not. If it is given, it
 *  checks whether a book document with given ISBN value already exists. If it does and it is not the same document that is currently updated, it 
 *  returns a JSON object containing error message with HTTP status code of 409. If it is the same document with the one that is currently updated, 
 *  it returns a JSON object with information message about book document is not updated and book document without any update with HTTP status code
 *  of 200. If there are no book documents with given ISBN value, it updates ISBN value of book document. Next, it checks whether author field in 
 *  body is null or not. If it is not null, it checks whether an author document with given author id value exists, if not it returns a JSON object
 *  containing error message with HTTP status code of 404. If the author exists, it updates author field of book document. Then, remaining update
 *  operations are executed and book document is saved. Lastly, it gets author document from Author collection using the author id value in author 
 *  field of book document and returns a JSON object containing success message and updated book document with HTTP status code of 200.
 * 
 *  If any error occurs during that process, it returns a JSON object containing error message with HTTP status code of 500.
 * 
 * @returns {string, Object} Success message, Book document
 * @returns {string} Error message
 */

export default async (req, res) => {
    try {
        // checks if given values in body are valid or not, if so returns error message in response
        const { error } = validateEditBook(req.body);
        if (error) {
            return res.status(400).json({ message: error.message })
        }
        
        // queries Book collection in database to get the book document with given id
        let book = await Book.findById(req.params.id)

        // if there are no book documents with given id in Book collection in database, returns error message in response
        if (!book) {
            return res.status(404).json({ message: "There are no books with given ID" })
        }

        // checks if ISBN value is given in body or not
        if (req.body.ISBN) {

            // queries Book collection in database to get the book document with given ISBN value
            const sameISBNBook = await Book.findOne({ ISBN: req.body.ISBN })

            // checks if there is a book document with given ISBN value
            if (sameISBNBook) {

                // checks if it is the same book document as the document that is currently updated
                if (sameISBNBook._id.toString() !== req.params.id) {

                    // if not, returns error message in response
                    return res.status(409).json({ message: "There already exists a book with given ISBN code" });
                }

            } else {
                // updates ISBN value
                book.ISBN = req.body.ISBN;
            }
        }

        // checks whether author value is given in body or not
        if (req.body.author) {

            // queries Author collection in database to decide whether an author document with given author id value exists or not
            const authorExists = await Author.exists({ _id: req.body.author });

            // if there are not any author documents with given author id, returns error message in response
            if (!authorExists) {
                return res.status(404).json({ message: "There are no authors with given author ID" });
            }

            // updates author value
            book.author = req.body.author;
        }

        // updates book document
        if (req.body.title) book.title = req.body.title;
        if (req.body.price) book.price = req.body.price;
        if (req.body.language) book.language = req.body.language;
        if (req.body.numberOfPages) book.numberOfPages = req.body.numberOfPages;
        if (req.body.publisher) book.publisher = req.body.publisher;

        // saves updated book document to database
        book = await book.save()

        // gets author document from Author collection using the author id value
        book = await Book.populate(book, { path: "author" });

        // returns success message and updated book document in response
        return res.status(200).json({ 
            message: "Book is successfully updated",
            book: book
        });

    } catch (error) {
        // returns error message in response if any error occurs
        return res.status(500).json({ message: "Something went wrong" });
    }
}