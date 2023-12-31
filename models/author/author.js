import mongoose from "mongoose";
import countries from "./countries.js";

const { Schema, model } = mongoose;

const authorSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },

    country: {
        type: String,
        validate: {
            validator: function (value) {
              const lowercaseValue = value.toLowerCase();
              return countries.some(country => country.toLowerCase() === lowercaseValue);
            },
            message: "There are no such countries.",
          },
        default: "Unknown",
        // converts every word in country field to Pascal case
        get: function (value) {
            const words = value.toLowerCase().split(' ');
            const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
            return capitalizedWords.join(' ');
        }
    },

    birthDate: {
        type: Date,
        // max value for this field can be date of current time
        max: () => Date.now(),
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

const Author = model("Author", authorSchema);
export default Author;