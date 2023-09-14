import Joi from "joi";
import { countries } from "../models/index.js";

export function validateCreateAuthor(body) {
    const schema = Joi.object({
        name: Joi.string().required(),
        // country value should be one of the values in countries.json file and it is case insensitive
        country: Joi.string().valid(...countries).default("Unknown").insensitive(true),
        birthDate: Joi.date().max('now')
    });

    return schema.validate(body);
}

export function validateEditAuthor(body) {
    const schema = Joi.object({
        name: Joi.string(),
        // country value should be one of the values in countries.json file and it is case insensitive
        country: Joi.string().valid(...countries).insensitive(true),
        birthDate: Joi.date().max('now')
    });

    return schema.validate(body);
}