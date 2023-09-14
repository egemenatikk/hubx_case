import { Book, Author } from "../../models/index.js";
import { validateCreateBook } from "../../validators/bookValidator.js";

export default async (req, res) => {
    try {
        const { error } = validateCreateBook(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const bookExists = await Book.exists({ ISBN: req.body.ISBN });

        if (bookExists) {
            return res.status(409).json({ message: "There already exists a book with given ISBN code" });
        }

        const authorExists = await Author.exists({ _id: req.body.author });

        if (!authorExists) {
            return res.status(404).json({ message: "There are no authors with given author ID" });
        }

        let book = new Book({
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            ISBN: req.body.ISBN,
            language: req.body.language,
            numberOfPages: req.body.numberOfPages,
            publisher: req.body.publisher
        });

        book = await book.save()

        book = await Book.populate(book, { path: "author" });

        return res.status(201).json({ 
            message: "Book is successfully created",
            book: book
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}