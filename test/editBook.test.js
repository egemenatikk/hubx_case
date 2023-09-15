import { expect } from "expect";
import request from "supertest";
import { Author, Book } from "../models/index.js";
import app from "../app.js";

let firstNewAuthorId = "";

let firstNewBookId = "";
let secondNewBookId = "";

describe("Edit Book Endpoint: PUT /book/:id", () => {

    before(async () => {
        const firstNewAuthor = {
            name: "Stephen King",
            birthDate: "1947-09-21",
            country: "United States"
        };

        const firstAuthorResponse = await request(app)
            .post("/author")
            .send(firstNewAuthor);

        firstNewAuthorId = firstAuthorResponse.body.author.id;

        const firstNewBook = {
            title: "It",
            author: firstNewAuthorId,
            ISBN: "978-9752119277",
            language: "English",
            numberOfPages: 1216,
        };

        const firstBookResponse = await request(app)
            .post("/book")
            .send(firstNewBook)

        firstNewBookId = firstBookResponse.body.book.id;

        const secondNewBook = {
            title: "Green Mile",
            author: firstNewAuthorId,
            ISBN: "978-9752100299"
        };

        const secondBookResponse = await request(app)
            .post("/book")
            .send(secondNewBook)

        secondNewBookId = secondBookResponse.body.book.id;
    });

    it("should return a 400 error if the 'language' is not on the languages list", (done) => {
        const newBook = {
            language: "NonexistentLanguage"
        };

        request(app)
            .put(`/book/${secondNewBookId}`)
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("\"language\" must be one of [Abkhazian, Afar, Afrikaans, Akan, Albanian, Amharic, Arabic, Aragonese, Armenian, Assamese, Avaric, Avestan, Aymara, Azerbaijani, Bambara, Bashkir, Basque, Belarusian, Bengali, Bihari, Bislama, Bosnian, Breton, Bulgarian, Burmese, Catalan, Chamorro, Chechen, Chichewa, Chinese, Chuvash, Cornish, Corsican, Cree, Croatian, Czech, Danish, Divehi, Dutch, Dzongkha, English, Esperanto, Estonian, Ewe, Faroese, Fijian, Finnish, French, Frisian, Fulah, Galician, Ganda, Georgian, German, Greek, Guarani, Gujarati, Haitian, Hausa, Hebrew, Herero, Hindi, Hiri Motu, Hungarian, Icelandic, Ido, Igbo, Indonesian, Interlingua, Interlingue, Inuktitut, Inupiaq, Irish, Italian, Japanese, Javanese, Kalaallisut, Kannada, Kanuri, Kashmiri, Kazakh, Kikuyu, Kinyarwanda, Kirghiz, Komi, Kongo, Korean, Kurdish, Kwanyama, Lao, Latin, Latvian, Limburgish, Lingala, Lithuanian, Luba-Katanga, Luxembourgish, Macedonian, Malagasy, Malay, Malayalam, Maltese, Manx, Maori, Marathi, Marshallese, Mongolian, Nauru, Navajo, Ndebele, Ndonga, Nepali, Northern, Norwegian, Occitan, Ojibwa, Oriya, Oromo, Ossetian, Pali, Panjabi, Pashto, Persian, Polish, Portuguese, Pushto, Quechua, Romanian, Russian, Rwanda, Samoan, Sango, Sanskrit, Sardinian, Scottish, Serbian, Shona, Sindhi, Sinhalese, Slovak, Slovenian, Somali, Sotho, Spanish, Sundanese, Swahili, Swazi, Swedish, Tagalog, Tahitian, Tajik, Tamil, Tatar, Telugu, Thai, Tibetan, Tigrinya, Tonga, Tsonga, Tswana, Turkish, Turkmen, Twi, Uighur, Ukrainian, Urdu, Uzbek, Venda, Vietnamese, Volapük, Walloon, Welsh, Wolof, Xhosa, Yiddish, Yoruba, Zhuang, Zulu, Unknown]");
            })
            .end(done);
    });

    it("should return a 400 error code if the 'price' is a negative number", (done) => {
        const newBook = {
            price: -5
        };

        request(app)
            .put(`/book/${secondNewBookId}`)
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("\"price\" must be greater than or equal to 0");
            })
            .end(done);
    });

    it("should return a 400 error code if the 'numberOfPages' is less than 1", (done) => {
        const newBook = {
            numberOfPages: -2
        };

        request(app)
            .put(`/book/${secondNewBookId}`)
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("\"numberOfPages\" must be greater than or equal to 1");
            })
            .end(done);
    });

    it("should return a 404 error code if a book with given id does not exist in database", (done) => {
        const newBook = {
            title: "Yesil Yol",
            author: firstNewAuthorId,
            ISBN: "978-9752100299",
            price: 100,
            language: "Turkish",
            numberOfPages: 448,
        };

        request(app)
        .put(`/book/012345678901234567890123`)
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There are no books with given ID");
            })
            .end(done);
    });

    it("should return a 409 error if a book with the same ISBN already exists", (done) => {
        const existingBook = {
            title: "Yesil Yol",
            author: firstNewAuthorId,
            ISBN: "978-9752119277",
            price: 100,
            language: "Turkish",
            numberOfPages: 448,
        };

        request(app)
        .put(`/book/${secondNewBookId}`)
            .send(existingBook)
            .expect((res) => {
                expect(res.status).toBe(409);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There already exists a book with given ISBN code");
            })
            .end(done);
    });

    it("should edit a book with success if there are no validation errors and there are no book with the same ISBN in database even if some fields are missing because they are not required", (done) => {
        const existingBook = {
            title: "Yesil Yol",
            author: firstNewAuthorId,
            ISBN: "978-9752100299",
            price: 100,
            language: "Turkish",
            numberOfPages: 448,
        };

        request(app)
        .put(`/book/${secondNewBookId}`)
            .send(existingBook)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Book is successfully updated");
                expect(res.body).toHaveProperty("book");
            })
            .end(done);
    });

    it("should return a 404 error code if an author with given author id does not exist in database", (done) => {
        const existingBook = {
            author: "012345678901234567890123",
            price: 470
        };

        request(app)
        .put(`/book/${firstNewBookId}`)
            .send(existingBook)
            .expect((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There are no authors with given author ID");
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
