import { config } from "dotenv";
config();

const { PORT, DB_URI, DOCKER_DB_URI, USERNAME, PASSWORD } = process.env;

export const port = PORT || 8080;
export const dbUri = DOCKER_DB_URI || DB_URI;
export const username = USERNAME;
export const password = PASSWORD;