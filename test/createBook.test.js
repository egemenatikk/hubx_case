import { expect } from "expect";
import request from "supertest";
import { Author, Book } from "../models/index.js";
import app from "../app.js";

let firstNewAuthorId = "";

let firstNewBookId = "";
let secondNewBookId = "";

describe("Create Book Endpoint: POST /book", () => {

    before(async () => {
        const firstNewAuthor = {
            name: "Rifat Ilgaz",
            birthDate: "1911-05-08",
            country: "Turkey"
        };

        const firstResponse = await request(app)
            .post("/author")
            .send(firstNewAuthor);

        firstNewAuthorId = firstResponse.body.author.id;
    });

    it("should create a book if there are no validation errors, a book with same ISBN number does not exist and the author exists", (done) => {

        const newBook = {
            title: "Hababam Sinifi",
            author: firstNewAuthorId,
            ISBN: "978-9753482639",
            price: 73.44,
            language: "Turkish",
            numberOfPages: 516,
        };

        console.log(firstNewAuthorId);
        request(app)
            .post("/book")
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(201);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Book is successfully created");
                expect(res.body).toHaveProperty("book");
                expect(res.body.book.author.id).toBe(firstNewAuthorId)
                firstNewBookId = res.body.book.id;
            })
            .end(done);
    });

    it("should return a 400 error code if the 'title' field is missing in body", (done) => {
        const newBook = {
            author: firstNewAuthorId,
            ISBN: "1234567890",
        };

        console.log(firstNewAuthorId);
        request(app)
            .post("/book")
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("\"title\" is required");
            })
            .end(done);
    });

    it("should return a 400 error code if the 'ISBN' field is missing in body", (done) => {
        const newBook = {
            title: "Hababam Sinifi Sinifta Kaldi",
            author: firstNewAuthorId,
        };

        console.log(firstNewAuthorId);
        request(app)
            .post("/book")
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("\"ISBN\" is required");
            })
            .end(done);
    });

    it("should return a 400 error code if the 'price' is a negative number", (done) => {
        const newBook = {
            title: "Hababam Sinifi Sinifta Kaldi",
            author: firstNewAuthorId,
            ISBN: "1234567890",
            price: -9.99,
        };

        request(app)
            .post("/book")
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
            title: "Hababam Sinifi Sinifta Kaldi",
            author: firstNewAuthorId,
            ISBN: "1234567890",
            numberOfPages: 0,
        };

        request(app)
            .post("/book")
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("\"numberOfPages\" must be greater than or equal to 1");
            })
            .end(done);
    });

    it("should return a 404 error code if the author ID does not exist", (done) => {
        const newBook = {
            title: "Hababam Sinifi",
            author: "012345678901234567890123",
            ISBN: "1234567890",
        };

        request(app)
            .post("/book")
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There are no authors with given author ID");
            })
            .end(done);
    });

    it("should return a 409 error code if a book with the same ISBN already exists", (done) => {
        const newBook = {
            title: "Hababam Sinifi Sinifta Kaldi",
            author: firstNewAuthorId,
            ISBN: "978-9753482639",
        };

        request(app)
            .post("/book")
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(409);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There already exists a book with given ISBN code");
            })
            .end(done);
    });

    it("should return a 404 error code if a an author with given author id does not exist", (done) => {
        const newBook = {
            title: "Hababam Sinifi Sinifta Kaldi",
            author: "012345678901234567890123",
            ISBN: "978-9753482660",
        };

        request(app)
            .post("/book")
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There are no authors with given author ID");
            })
            .end(done);
    });

    it("should return a 400 error if the 'language' is not on the languages list", (done) => {
        const newBook = {
            title: "Hababam Sinifi Sinifta Kaldi",
            author: firstNewAuthorId,
            ISBN: "978-9753482660",
            language: "NonexistentLanguage"
        };

        request(app)
            .post("/book")
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("\"language\" must be one of [Abkhazian, Afar, Afrikaans, Akan, Albanian, Amharic, Arabic, Aragonese, Armenian, Assamese, Avaric, Avestan, Aymara, Azerbaijani, Bambara, Bashkir, Basque, Belarusian, Bengali, Bihari, Bislama, Bosnian, Breton, Bulgarian, Burmese, Catalan, Chamorro, Chechen, Chichewa, Chinese, Chuvash, Cornish, Corsican, Cree, Croatian, Czech, Danish, Divehi, Dutch, Dzongkha, English, Esperanto, Estonian, Ewe, Faroese, Fijian, Finnish, French, Frisian, Fulah, Galician, Ganda, Georgian, German, Greek, Guarani, Gujarati, Haitian, Hausa, Hebrew, Herero, Hindi, Hiri Motu, Hungarian, Icelandic, Ido, Igbo, Indonesian, Interlingua, Interlingue, Inuktitut, Inupiaq, Irish, Italian, Japanese, Javanese, Kalaallisut, Kannada, Kanuri, Kashmiri, Kazakh, Kikuyu, Kinyarwanda, Kirghiz, Komi, Kongo, Korean, Kurdish, Kwanyama, Lao, Latin, Latvian, Limburgish, Lingala, Lithuanian, Luba-Katanga, Luxembourgish, Macedonian, Malagasy, Malay, Malayalam, Maltese, Manx, Maori, Marathi, Marshallese, Mongolian, Nauru, Navajo, Ndebele, Ndonga, Nepali, Northern, Norwegian, Occitan, Ojibwa, Oriya, Oromo, Ossetian, Pali, Panjabi, Pashto, Persian, Polish, Portuguese, Pushto, Quechua, Romanian, Russian, Rwanda, Samoan, Sango, Sanskrit, Sardinian, Scottish, Serbian, Shona, Sindhi, Sinhalese, Slovak, Slovenian, Somali, Sotho, Spanish, Sundanese, Swahili, Swazi, Swedish, Tagalog, Tahitian, Tajik, Tamil, Tatar, Telugu, Thai, Tibetan, Tigrinya, Tonga, Tsonga, Tswana, Turkish, Turkmen, Twi, Uighur, Ukrainian, Urdu, Uzbek, Venda, Vietnamese, Volapük, Walloon, Welsh, Wolof, Xhosa, Yiddish, Yoruba, Zhuang, Zulu, Unknown]");
            })
            .end(done);
    });

    it("should create a book if there are no validation errors, a book with same ISBN number does not exist and the author exists even if some non-required fields are empty", (done) => {

        const newBook = {
            title: "Hababam Sinifi Sinifta Kaldi",
            author: firstNewAuthorId,
            ISBN: "978-9753482660",
        };

        request(app)
            .post("/book")
            .send(newBook)
            .expect((res) => {
                expect(res.status).toBe(201);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Book is successfully created");
                expect(res.body).toHaveProperty("book");
                expect(res.body.book.author.id).toBe(firstNewAuthorId)
                secondNewBookId = res.body.book.id;
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
