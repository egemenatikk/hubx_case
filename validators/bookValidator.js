import Joi from "joi";
import languages from "../models/languages.js";

export function validateCreateBook(body) {
    const schema = Joi.object({
        title: Joi.string().required(),
        author: Joi.string().hex().length(24).required(),
        price: Joi.number().min(0),
        ISBN: Joi.string().required(),
        language: Joi.string().valid(...languages).default("Unknown").insensitive(true),
        numberOfPages: Joi.number().min(1),
        publisher: Joi.string().default("Unknown"),
    });

    return schema.validate(body);
}

export function validateEditBook(body) {
    const schema = Joi.object({
        title: Joi.string(),
        author: Joi.string().hex().length(24),
        price: Joi.number().min(0),
        ISBN: Joi.string(),
        language: Joi.string().valid(...languages).insensitive(true),
        numberOfPages: Joi.number().min(1),
        publisher: Joi.string(),
    });

    return schema.validate(body);
}