import { expect } from "expect";
import request from "supertest";
import app from "../app.js";

let firstNewAuthorId = "";

describe("Delete Author Endpoint: DELETE /author/:id", () => {

    before(async () => {
        const firstNewAuthor = {
            name: "George Orwell",
            birthDate: "1903-06-25",
            country: "India"
        };

        const firstResponse = await request(app)
            .post("/author")
            .send(firstNewAuthor);

        firstNewAuthorId = firstResponse.body.author.id;
    });

    it("should return a 404 error code if an author with given id does not exist in database", (done) => {

        request(app)
        .delete(`/author/012345678901234567890123`)
            .expect((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There are no authors with given ID");
            })
            .end(done);
    });

    it("should delete an author with success if author exists in database", (done) => {

        request(app)
        .delete(`/author/${firstNewAuthorId}`)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Author is successfully deleted");
            })
            .end(done);
    });
});
