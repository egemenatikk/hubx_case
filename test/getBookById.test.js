import { expect } from "expect";
import request from "supertest";
import { Book, Author } from "../models/index.js";
import app from "../app.js";

let firstNewAuthorId = "";

let firstNewBookId = "";
let secondNewBookId = "";

describe("Get Book by Id Endpoint: GET /book/:id", () => {

    before(async () => {

        const firstNewAuthor = {
            name: "Lev Tolstoy",
            birthDate: "1828-09-09",
            country: "Russian Federation"
        };

        const firstAuthorResponse = await request(app)
            .post("/author")
            .send(firstNewAuthor);

        firstNewAuthorId = firstAuthorResponse.body.author.id;

        const firstNewBook = {
            title: "Anna Karenina",
            author: firstNewAuthorId,
            price: 97.50,
            ISBN: "978-6053604099",
            language: "Turkish",
            numberOfPages: 1062,
        };

        const firstBookResponse = await request(app)
            .post("/book")
            .send(firstNewBook);

        firstNewBookId = firstBookResponse.body.book.id;

        const secondNewBook = {
            title: "War and Peace",
            author: firstNewAuthorId,
            ISBN: "978-9750512322",
            price: 262.5,
            language: "English",
            numberOfPages: 1822,
        };

        const secondBookResponse = await request(app)
            .post("/book")
            .send(secondNewBook);

        secondNewBookId = secondBookResponse.body.book.id;
    });

    it("should return a 404 error code if a book with given id does not exist in database", (done) => {

        request(app)
        .get(`/book/012345678901234567890123`)
            .expect((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There are no books with given ID");
            })
            .end(done);
    });

    it("should get a book by id with success if book exists in database", (done) => {

        request(app)
        .get(`/book/${firstNewBookId}`)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Book is successfully fetched");
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
