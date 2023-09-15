import { expect } from "expect";
import request from "supertest";
import { Author } from "../models/index.js";
import app from "../app.js";

let firstNewAuthorId = "";

let firstNewBookId = "";

describe("Delete Book Endpoint: DELETE /book/:id", () => {

    before(async () => {
        const firstNewAuthor = {
            name: "Lewis Carroll",
            birthDate: "1832-01-27",
            country: "United Kingdom"
        };

        const firstAuthorResponse = await request(app)
            .post("/author")
            .send(firstNewAuthor);

        firstNewAuthorId = firstAuthorResponse.body.author.id;

        const firstNewBook = {
            title: "Alice in Wonderland",
            author: firstNewAuthorId,
            ISBN: "978-1503222687",
            language: "English",
            numberOfPages: 70,
        };

        const firstBookResponse = await request(app)
            .post("/book")
            .send(firstNewBook);

        firstNewBookId = firstBookResponse.body.book.id;
    });

    it("should return a 404 error code if a book with given id does not exist in database", (done) => {

        request(app)
        .delete(`/book/012345678901234567890123`)
            .expect((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There are no books with given ID");
            })
            .end(done);
    });

    it("should delete a book with success if book exists in database", (done) => {

        request(app)
        .delete(`/book/${firstNewBookId}`)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Book is successfully deleted");
            })
            .end(done);
    });

    after(async () => {
        try {

            if (firstNewAuthorId) {
                await Author.findByIdAndRemove(firstNewAuthorId);
            }
        } catch (error) {
            console.error("Error deleting author:", error);
        }
    });
});
