import { config } from "dotenv";
config();

const { PORT, DB_URI, DOCKER_DB_URI, USERNAME, PASSWORD, NODE_ENV } = process.env;

export const port = PORT || 8080;
export const dbUri = DOCKER_DB_URI || DB_URI;
export const username = USERNAME;
export const password = PASSWORD;
console.log(process.env.NODE_ENV);
export const nodeEnvironment = NODE_ENV;