import { expect } from "expect";
import request from "supertest";
import { Author, Book } from "../models/index.js";
import app from "../app.js";

let firstNewAuthorId = "";

let firstNewBookId = "";
let secondNewBookId = "";

describe("Get all Books Endpoint: GET /book", () => {

    before(async () => {
        const firstNewAuthor = {
            name: "Roald Dahl",
            birthDate: "1916-09-13",
            country: "United Kingdom"
        };

        const firstAuthorResponse = await request(app)
            .post("/author")
            .send(firstNewAuthor);

        firstNewAuthorId = firstAuthorResponse.body.author.id;

        const firstNewBook = {
            title: "Charlie's Chocolate Factory",
            author: firstNewAuthorId,
            price: 69.10,
            ISBN: "978-9755100982",
            language: "English",
            numberOfPages: 208,
        };

        const firstBookResponse = await request(app)
            .post("/book")
            .send(firstNewBook);

        firstNewBookId = firstBookResponse.body.book.id;

        const secondNewBook = {
            title: "Fantastic Mr. Fox",
            author: firstNewAuthorId,
            ISBN: "978-0142410349",
            language: "English",
            numberOfPages: 81,
        };

        const secondBookResponse = await request(app)
            .post("/book")
            .send(secondNewBook);

        secondNewBookId = secondBookResponse.body.book.id;
    });

    it("should get the list of all books with success", (done) => {

        request(app)
        .get(`/book`)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("All books are successfully fetched");
                expect(res.body).toHaveProperty("books");
                expect(res.body.books).toHaveLength(2);
            })
            .end(done);
    });

    after(async () => {
        try {
            if (firstNewBookId) {
                await Book.findByIdAndRemove(firstNewBookId);
            }

            if (secondNewBookId) {
                await Book.findByIdAndRemove(secondNewBookId);
            }

            if (firstNewAuthorId) {
                await Author.findByIdAndRemove(firstNewAuthorId);
            }
        } catch (error) {
            console.error("Error deleting books:", error);
        }
    });
});
