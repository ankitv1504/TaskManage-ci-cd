# A Simple TODO APP

## Features

- Authenticate Users(Signup/Signin)
- List all TODOs
- Add TODO
- Update TODO
- Delete TODO
- Delete all TODOs
- TODO
  - Pagination
  - Mark TODO as completed
  - Mark all TODOs as completed

## Technologies

- Database
  - MongoDB
- Backend
  - Node.js
- Frontend
  - EJS
  - JS
  - CSS
- Server
  - Express

## Packages

- Backend
  - bcrypt - for hashing(encrypt/decrypt) passwords
  - cors - for allowing cross-origin requests
  - chalk - for adding styling to the console
  - dotenv - for loading environment variables
  - express - for creating the server and handling HTTP requests
  - mongoose - for working with MongoDB
  - connect-mongodb-session - for storing sessions in MongoDB
  - express-session - for storing sessions
  - validator - for validating input

- Frontend
  - ejs - for rendering HTML templates

- Development
  - eslint - for linting the code
  - prettier - for formatting the code
  - eslint-config-prettier - for linting the code with prettier
  - nodemon - for running the server in development mode

> To install the packages

```bash
npm i bcrypt chalk dotenv express mongoose connect-mongodb-session express-session ejs --save
```

> To install nodemon(for development mode)

```bash
npm i nodemon --save-dev
# or
npm i -g nodemon
```

> To install eslint and prettier for linting and formatting

```bash
npm i eslint prettier eslint-config-prettier --save-dev
eslint --init
```

> To run the server in development mode
