# hubx_case

This is my implementation for back end developer case of HubX recruitment assignment.

# In order to run this application:
- Firstly, Docker should be up and running
- Secondly, there should be a file named as ".env" where environment variables for application takes place. Here is an example content for .env file:
  <br> <br>
  PORT=8080 <br>
  DB_URI="mongodb://mongo:27017" <br>
  USERNAME="user" <br>
  PASSWORD="password" <br> <br>
- The crucial thing about .env file:
    1. USERNAME variable must match with MONGO_INITDB_ROOT_USERNAME variable in docker-compose.yml file
    2. PASSWORD variable must match with MONGO_INITDB_ROOT_PASSWORD variable in docker-compose.yml file
 <br>

# If requirements above are met and necessary variables are added to .env file (you can use the example .env file I provided above directly), the application can be started with two commands (in given order):
1. docker-compose build
2. docker-compose up -d

### NOTE: These commands should be executed under base directory, in the same directory with Dockerfile and docker-compose.yml files <br>

# Here are brief explanations, example request and responses for endpoints in this application:
  