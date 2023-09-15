import { expect } from "expect";
import request from "supertest";
import { Author } from "../models/index.js";
import app from "../app.js";

let firstNewAuthorId = "";
let secondNewAuthorId = "";

describe("Get all Authors Endpoint: GET /author", () => {

    before(async () => {
        const firstNewAuthor = {
            name: "Cengiz Aytmatov",
            birthDate: "1928-12-12",
            country: "Kyrgyzstan"
        };

        const firstResponse = await request(app)
            .post("/author")
            .send(firstNewAuthor);

        firstNewAuthorId = firstResponse.body.author.id;

        const secondNewAuthor = {
            name: "Miguel de Cervantes",
            birthDate: "1547-09-29",
            country: "Spain"
        };

        const secondResponse = await request(app)
            .post("/author")
            .send(secondNewAuthor);

        secondNewAuthorId = secondResponse.body.author.id;
    });

    it("should get the list of all authors with success", (done) => {

        request(app)
        .get(`/author`)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("All authors are successfully fetched");
                expect(res.body).toHaveProperty("authors");
                expect(res.body.authors).toHaveLength(2);
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
