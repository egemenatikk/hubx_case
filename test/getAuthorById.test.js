import { expect } from "expect";
import request from "supertest";
import { Author } from "../models/index.js";
import app from "../app.js";

let firstNewAuthorId = "";
let secondNewAuthorId = "";

describe("Get Author By Id Endpoint: GET /author/:id", () => {

    before(async () => {
        const firstNewAuthor = {
            name: "Jules Verne",
            birthDate: "1828-02-08",
            country: "France"
        };

        const firstResponse = await request(app)
            .post("/author")
            .send(firstNewAuthor);

        firstNewAuthorId = firstResponse.body.author.id;

        const secondNewAuthor = {
            name: "H. G. Wells",
            birthDate: "1866-09-21",
            country: "United Kingdom"
        };

        const secondResponse = await request(app)
            .post("/author")
            .send(secondNewAuthor);

        secondNewAuthorId = secondResponse.body.author.id;
    });

    it("should return a 404 error code and if an author with given id does not exist in database", (done) => {

        request(app)
        .get(`/author/012345678901234567890123`)
            .expect((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There are no authors with given ID");
            })
            .end(done);
    });

    it("should get the author by id with success if author exists in database", (done) => {

        request(app)
        .get(`/author/${firstNewAuthorId}`)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Author is successfully fetched");
                expect(res.body).toHaveProperty("author");
                expect(res.body.author.name).toBe("Jules Verne");
                expect(res.body.author.id).toBe(firstNewAuthorId);
                expect(res.body.author.country).toBe("France");
                expect(res.body.author.birthDate.substring(0, 10)).toBe("1828-02-08")
            })
            .end(done);
    });

    after(async () => {
        try {
            if (firstNewAuthorId) {
                await Author.findByIdAndRemove(firstNewAuthorId);
            }
            
            if (secondNewAuthorId) {
                await Author.findByIdAndRemove(secondNewAuthorId);
            }
            
        } catch (error) {
            console.error("Error deleting author:", error);
        }
    });
});
