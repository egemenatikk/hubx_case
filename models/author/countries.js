import { readFile } from "fs/promises";

const countries = JSON.parse(
    await readFile(new URL("./countries.json", import.meta.url))
).countries;

export default countries;