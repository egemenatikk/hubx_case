import { readFile } from "fs/promises";

const languages = JSON.parse(
    await readFile(new URL("./languages.json", import.meta.url))
).languages;

export default languages;