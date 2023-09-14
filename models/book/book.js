import mongoose from "mongoose";
import languages from "./languages.js";

const { Schema, model } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Author",
        required: true
    },
    price: {
        type: Number,
        min: 0
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    language: {
        type: String,
        validate: {
            validator: function (value) {
              const lowercaseValue = value.toLowerCase();
              return languages.some(lang => lang.toLowerCase() === lowercaseValue);
            },
            message: "There are no such languages.",
          },
        default: "Unknown",
        get: function (value) {
            const words = value.toLowerCase().split(' ');
            const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
            return capitalizedWords.join(' ');
        }
    },
    numberOfPages: {
        type: Number,
        min: 1
    },
    publisher: {
        type: String,
        default: "Unknown"
    }
},
{ 
    timestamps: true,
    toJSON: {
        getters: true,
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            return ret;
        },
        virtuals: true,
    },
    versionKey: false 
});

const Book = model("Book", bookSchema);
export default Book;