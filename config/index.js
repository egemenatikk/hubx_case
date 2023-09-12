import { config } from "dotenv";
config();

const { PORT, DB_URI, DOCKER_DB_URI } = process.env;

export const port = PORT || 8080;
export const dbUri = DOCKER_DB_URI || DB_URI;