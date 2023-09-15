# hubx_case

This is my implementation for back end developer case of HubX recruitment assignment.

# In order to run this application:
- Firstly, Docker should be up and running
- Secondly, there should be a file named as ".env" where environment variables for application takes place. Here is an example content for .env file:
  <br> <br>
  PORT=3000 <br>
  DB_URI="mongodb://mongo:27017" <br>
  USERNAME="user" <br>
  PASSWORD="password" <br>
  NODE_ENV="test" <br>
- The crucial thing about .env file:
    1. USERNAME variable must match with MONGO_INITDB_ROOT_USERNAME variable in docker-compose.yml file
    2. PASSWORD variable must match with MONGO_INITDB_ROOT_PASSWORD variable in docker-compose.yml file
    3. When NODE_ENV value is set to "test", tests will be executed
    4. When NODE_ENV value is set to another value, tests will not be executed <br>

 
# If requirements above are met and necessary variables are added to .env file (you can use the example .env file I provided above directly), the application can be started with two commands (in given order):
1. docker-compose build
2. docker-compose up -d

### NOTE: These commands should be executed under base directory, in the same directory with Dockerfile and docker-compose.yml files <br>
 <br> 

# Here are brief informations about some endpoints: <br>
1. While creating an author object, country value should be one of the values inside the countries.json file or it should left empty
2. While creating a book object, language value should be one of the values inside the languages.json file or it should be left empty
3. For creating an author, name value is required
4. For creating a book; title, author and ISBN values are required
5. For creating a book, id of an existing author should be given as book's author value
6. Route for book endpoints is: /book
7. Route for author endpoints is: /author
8. For update, delete and get by id operations, path should be like: /author/{authorId} and /book/{bookId}

# Here are example requests and responses:

1. Author
   - POST
     - Request:
       - Path: http://localhost:3000/author
       - Body: {  
                "name": "Egemen Atik",  
                "country": "Turkey",  
                "birthDate": "2000-10-11"  
               }  
     - Response:  
        {  
          "message": "Author is successfully created",  
          "author": {  
              "name": "Egemen Atik",  
              "country": "Turkey",  
              "birthDate": "2000-10-11T00:00:00.000Z",  
              "createdAt": "2023-09-15T18:22:56.557Z",  
              "updatedAt": "2023-09-15T18:22:56.557Z",  
              "id": "6504a100c21e8f329c80e11c"   
          }  
        }
   - GET:
     - Request:
       - Path: http://localhost:3000/author
      - Response:  
        {  
          "message": "All authors are successfully fetched",    
          "authors": [{    
              "name": "Egemen Atik",    
              "country": "Turkey",    
              "birthDate": "2000-10-11T00:00:00.000Z",    
              "createdAt": "2023-09-15T18:22:56.557Z",    
              "updatedAt": "2023-09-15T18:22:56.557Z",    
              "id": "6504a100c21e8f329c80e11c"     
          }    
        }] } 

   - GET:
     - Request:
       - Path: http://localhost:3000/author/6504a100c21e8f329c80e11c
     - Response:  
        {
          "message": "Author is successfully fetched",  
          "author": {  
              "name": "Egemen Atik",  
              "country": "Turkey",  
              "birthDate": "2000-10-11T00:00:00.000Z",  
              "createdAt": "2023-09-15T18:22:56.557Z",  
              "updatedAt": "2023-09-15T18:22:56.557Z",   
              "id": "6504a100c21e8f329c80e11c"   
        }

   - PUT:
     - Request:
         - Path: http://localhost:3000/author/6504a100c21e8f329c80e11c    
         - Body: {   
                "country": "Spain",     
               }    
     - Response:  
            {  
              "message": "Author is successfully updated",  
              "author": {  
                  "name": "Egemen Atik",  
                  "country": "Spain",  
                  "birthDate": "2000-10-11T00:00:00.000Z",  
                  "createdAt": "2023-09-15T18:22:56.557Z",  
                  "updatedAt": "2023-09-15T18:32:49.503Z",  
                  "id": "6504a100c21e8f329c80e11c"  
              }  
            }  
              
   - DELETE:  
     - Request:  
         - Path: http://localhost:3000/author/6504a100c21e8f329c80e11c  
     - Response:    
            {  
              "message": "Author is successfully deleted"  
            }  

2. Book
   - POST  
     - Request:  
       - Path: http://localhost:3000/book  
       - Body: {  
                  "title": "My Book",  
                  "author": "6504a100c21e8f329c80e11c",  
                  "ISBN": "01234567890",  
                  "language": "English"    
               }  
     - Response:  
        {  
          "message": "Book is successfully created",  
          "book": {  
              "title": "My Book",  
              "author": {  
                  "name": "Egemen Atik",  
                  "country": "Spain",  
                  "birthDate": "2000-10-11T00:00:00.000Z",  
                  "createdAt": "2023-09-15T18:22:56.557Z",   
                  "updatedAt": "2023-09-15T18:32:49.503Z",  
                  "id": "6504a100c21e8f329c80e11c"  
              },  
              "ISBN": "01234567890",  
              "language": "English",  
              "publisher": "Unknown",  
              "createdAt": "2023-09-15T18:35:16.471Z",  
              "updatedAt": "2023-09-15T18:35:16.471Z",  
              "id": "6504a3e4c21e8f329c80e125"  
          }  
        }  
   - GET:
     - Request:
       - Path: http://localhost:3000/book
     - Response:  
        {   
    "message": "All books are successfully fetched",  
    "books": [   
        {   
            "title": "My Book",   
            "author": {  
                "name": "Egemen Atik",  
                "country": "Spain",  
                "birthDate": "2000-10-11T00:00:00.000Z    
                "createdAt": "2023-09-15T18:22:56.557Z",  
                "updatedAt": "2023-09-15T18:32:49.503Z",  
                "id": "6504a100c21e8f329c80e11c"  
            },  
            "ISBN": "01234567890",  
            "language": "English",  
            "publisher": "Unknown",  
            "createdAt": "2023-09-15T18:35:16.471Z",  
            "updatedAt": "2023-09-15T18:35:16.471Z",   
            "id": "6504a3e4c21e8f329c80e125"  
        }  
    ]   
}    

   - GET:
     - Request:
       - Path: http://localhost:3000/book/650499df0a1fd4abe0462dcf
     - Response:  
        {  
    "message": "Book is successfully fetched",  
    "book": {  
        "title": "My Book",  
        "author": {  
            "name": "Egemen Atik",  
            "country": "Spain",  
            "birthDate": "2000-10-11T00:00:00.000Z",  
            "createdAt": "2023-09-15T18:22:56.557Z",  
            "updatedAt": "2023-09-15T18:32:49.503Z",  
            "id": "6504a100c21e8f329c80e11c"  
        },  
        "ISBN": "01234567890",  
        "language": "English",  
        "publisher": "Unknown",  
        "createdAt": "2023-09-15T18:35:16.471Z",  
        "updatedAt": "2023-09-15T18:35:16.471Z",  
        "id": "6504a3e4c21e8f329c80e125"  
    }  
}  

   - PUT:
       - Request:
         - Path: http://localhost:3000/book/650499df0a1fd4abe0462dcf
         - Body: {  
    "language": "Turkish"  
}  
       - Response:  
            {  
    "message": "Book is successfully updated",  
    "book": {  
        "title": "My Book",  
        "author": {  
            "name": "Egemen Atik",  
            "country": "Spain",  
            "birthDate": "2000-10-11T00:00:00.000Z",  
            "createdAt": "2023-09-15T18:22:56.557Z",  
            "updatedAt": "2023-09-15T18:32:49.503Z",  
            "id": "6504a100c21e8f329c80e11c"    
        },  
        "ISBN": "01234567890",  
        "language": "Turkish",  
        "publisher": "Unknown",  
        "createdAt": "2023-09-15T18:35:16.471Z",  
        "updatedAt": "2023-09-15T18:38:55.582Z",  
        "id": "6504a3e4c21e8f329c80e125"  
    }  
}  
            
   - DELETE:
       - Request:
         - Path: http://localhost:3000/book/650499df0a1fd4abe0462dcf
       - Response:  
            {
              "message": "Book is successfully deleted"
            }
