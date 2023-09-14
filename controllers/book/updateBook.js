import { Book, Author } from "../../models/index.js";
import { validateEditBook } from "../../validators/bookValidator.js";

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