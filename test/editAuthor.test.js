import { expect } from "expect";
import request from "supertest";
import { Author } from "../models/index.js";
import app from "../app.js";

let firstNewAuthorId = "";
let secondNewAuthorId = "";

describe("Edit Author Endpoint: PUT /author/:id", () => {

    before(async () => {
        const firstNewAuthor = {
            name: "J. R. R. Tolkien",
            birthDate: "1892-01-03",
            country: "South Africa"
        };

        const firstResponse = await request(app)
            .post("/author")
            .send(firstNewAuthor);

        firstNewAuthorId = firstResponse.body.author.id;

        const secondNewAuthor = {
            name: "Charles Dickens",
            country: "France"
        };

        const secondResponse = await request(app)
            .post("/author")
            .send(secondNewAuthor);

        secondNewAuthorId = secondResponse.body.author.id;
    });

    it("should return a 400 error if the 'country' is not on the countries list", (done) => {
        const newAuthor = {
            country: "NonexistentCountry"
        };

        request(app)
            .put(`/author/${secondNewAuthorId}`)
            .send(newAuthor)
            .expect((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("\"country\" must be one of [Afghanistan, Åland Islands, Albania, Algeria, American Samoa, Andorra, Angola, Anguilla, Antarctica, Antigua and Barbuda, Argentina, Armenia, Aruba, Australia, Austria, Azerbaijan, Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bermuda, Bhutan, Bolivia, Bosnia and Herzegovina, Botswana, Bouvet Island, Brazil, British Indian Ocean Territory, Brunei Darussalam, Bulgaria, Burkina Faso, Burundi, Cambodia, Cameroon, Canada, Cape Verde, Cayman Islands, Central African Republic, Chad, Chile, China, Christmas Island, Cocos (Keeling) Islands, Colombia, Comoros, Congo, Congo, The Democratic Republic of the, Cook Islands, Costa Rica, Cote D'Ivoire, Croatia, Cuba, Cyprus, Czech Republic, Denmark, Djibouti, Dominica, Dominican Republic, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia, Ethiopia, Falkland Islands (Malvinas), Faroe Islands, Fiji, Finland, France, French Guiana, French Polynesia, French Southern Territories, Gabon, Gambia, Georgia, Germany, Ghana, Gibraltar, Greece, Greenland, Grenada, Guadeloupe, Guam, Guatemala, Guernsey, Guinea, Guinea-Bissau, Guyana, Haiti, Heard Island and Mcdonald Islands, Holy See (Vatican City State), Honduras, Hong Kong, Hungary, Iceland, India, Indonesia, Iran, Islamic Republic Of, Iraq, Ireland, Isle of Man, Israel, Italy, Jamaica, Japan, Jersey, Jordan, Kazakhstan, Kenya, Kiribati, Korea, Democratic People'S Republic of, Korea, Republic of, Kuwait, Kyrgyzstan, Lao People'S Democratic Republic, Latvia, Lebanon, Lesotho, Liberia, Libyan Arab Jamahiriya, Liechtenstein, Lithuania, Luxembourg, Macao, Macedonia, The Former Yugoslav Republic of, Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall Islands, Martinique, Mauritania, Mauritius, Mayotte, Mexico, Micronesia, Federated States of, Moldova, Republic of, Monaco, Mongolia, Montserrat, Morocco, Mozambique, Myanmar, Namibia, Nauru, Nepal, Netherlands, Netherlands Antilles, New Caledonia, New Zealand, Nicaragua, Niger, Nigeria, Niue, Norfolk Island, Northern Mariana Islands, Norway, Oman, Pakistan, Palau, Palestinian Territory, Occupied, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Pitcairn, Poland, Portugal, Puerto Rico, Qatar, Reunion, Romania, Russian Federation, RWANDA, Saint Helena, Saint Kitts and Nevis, Saint Lucia, Saint Pierre and Miquelon, Saint Vincent and the Grenadines, Samoa, San Marino, Sao Tome and Principe, Saudi Arabia, Senegal, Serbia and Montenegro, Seychelles, Sierra Leone, Singapore, Slovakia, Slovenia, Solomon Islands, Somalia, South Africa, South Georgia and the South Sandwich Islands, Spain, Sri Lanka, Sudan, Suriname, Svalbard and Jan Mayen, Swaziland, Sweden, Switzerland, Syrian Arab Republic, Taiwan, Province of China, Tajikistan, Tanzania, United Republic of, Thailand, Timor-Leste, Togo, Tokelau, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Turks and Caicos Islands, Tuvalu, Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, United States Minor Outlying Islands, Uruguay, Uzbekistan, Vanuatu, Venezuela, Viet Nam, Virgin Islands, British, Virgin Islands, U.S., Wallis and Futuna, Western Sahara, Yemen, Zambia, Zimbabwe, Unknown]");
            })
            .end(done);
    });

    it("should return a 400 error if the 'birthDate' is not a valid date", (done) => {
        const newAuthor = {
            name: "Charles Dickens",
            birthDate: "InvalidDate",
            country: "United Kingdom"
        };

        request(app)
            .put(`/author/${secondNewAuthorId}`)
            .send(newAuthor)
            .expect((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("\"birthDate\" must be a valid date");
            })
            .end(done);
    });

    it("should return a 409 error if an author with the same information already exists", (done) => {
        const existingAuthor = {
            name: "J. R. R. Tolkien",
            birthDate: "1892-01-03",
            country: "South Africa"
        };

        request(app)
        .put(`/author/${secondNewAuthorId}`)
            .send(existingAuthor)
            .expect((res) => {
                expect(res.status).toBe(409);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There already exists an author with the exact same information");
            })
            .end(done);
    });

    it("should return a 200 status code and information message without updating if no changes made to informations of the author", (done) => {
        const existingAuthor = {
            name: "J. R. R. Tolkien",
            birthDate: "1892-01-03",
            country: "South Africa"
        };

        request(app)
        .put(`/author/${firstNewAuthorId}`)
            .send(existingAuthor)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Author is not updated since the information given is the same as the information of the existing author");
                expect(res.body).toHaveProperty("author");
                expect(res.body.author.id).toBe(firstNewAuthorId);
            })
            .end(done);
    });

    it("should return a 404 error code if an author with given id does not exist in database", (done) => {
        const newAuthor = {
            name: "J. R. R. Tolkien",
            birthDate: "1892-01-03",
            country: "South Africa"
        };

        request(app)
        .put(`/author/012345678901234567890123`)
            .send(newAuthor)
            .expect((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("There are no authors with given ID");
            })
            .end(done);
    });

    

    it("should edit an author with success if there are no validation errors and there are no authors with the same information in database even if some fields are missing because they are not required", (done) => {
        const newAuthor = {
            birthDate: "1812-02-07",
            country: "United Kingdom"
        };

        request(app)
        .put(`/author/${secondNewAuthorId}`)
            .send(newAuthor)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Author is successfully updated");
                expect(res.body).toHaveProperty("author")
                expect(res.body.author.id).toBe(secondNewAuthorId);
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
