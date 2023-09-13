import { Book } from "../../models/index.js";
import { validateEditBook } from "../../validators/bookValidator.js";

export default async (req, res) => {
    try {
        const { error } = validateEditBook(req.body);
        if (error) {
            return res.status(400).json({ message: error.message })
        }
        
        let book = await Book.findById(req.params.id)

        if (!book) {
            return res.status(404).json({ message: "There are no books with given ID" })
        }

        if (req.body.ISBN) {
            const bookExists = await Book.exists({ ISBN: req.body.ISBN })

            if (bookExists) {
                return res.status(409).json({ message: "There already exists a book with given ISBN code" });
            } else {
                book.ISBN = req.body.ISBN;
            }
        }

        if (req.body.title) book.title = req.body.title;
        if (req.body.author) book.author = req.body.author;
        if (req.body.price) book.price = req.body.price;
        if (req.body.language) book.language = req.body.language;
        if (req.body.numberOfPages) book.numberOfPages = req.body.numberOfPages;
        if (req.body.publisher) book.publisher = req.body.publisher;

        book = await book.save()

        return res.status(200).json({ 
            message: "Book is successfully updated",
            book: book
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}