# Lab 2: SQLite database and CRUD routes

**Name:** GURRALA SUJITH  
**Registration number:** 252U1R9045
**Section:** CSE GEN-AI 2A

## Live link

Not deployed yet. Add your deployed public URL here after deployment. If deployment is not possible, explain why and include Postman screenshots for every endpoint.

## Objective

Connect an Express server to a SQLite database and expose CRUD operations over HTTP.

## How to install and run

1. Install Node.js.
2. Open this folder in VS Code.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create the database and insert the sample books:

   ```bash
   node seed.js
   ```

5. Start the server with automatic restart:

   ```bash
   npm run dev
   ```

The server runs at `http://localhost:3000`.

## Endpoints

| Method | Path              | Description                 |
| ------ | ----------------- | --------------------------- |
| GET    | `/books/`         | Get all books               |
| GET    | `/books/:bookId/` | Get one book by ID          |
| POST   | `/books/`         | Add a book                  |
| PUT    | `/books/:bookId/` | Update all fields of a book |
| DELETE | `/books/:bookId/` | Delete a book               |

### POST request body example

```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "price": 250,
  "pages": 208
}
```

Use the same JSON structure for `PUT`, changing the values as needed. In Postman, choose **Body → raw → JSON** for POST and PUT.

## Screenshots

Save your actual Postman and SQLite screenshots in the `screenshots/` folder, then add them here. Example:

```md
![Get all books](screenshots/get-all-books.png)
![Get one book](screenshots/get-one-book.png)
![Add a book](screenshots/post-book.png)
![Update a book](screenshots/put-book.png)
![Delete a book](screenshots/delete-book.png)
![SQLite database](screenshots/sqlite-database.png)
```

## Notes: problems faced and how they were solved

- Used `async/await` so database operations finish before a response is sent.
- Used `?` placeholders and parameter arrays to prevent SQL injection.
- Returned `404` when a requested book does not exist.
- Added `.gitignore` so `node_modules` and `.env` are not committed.

## Viva preparation

**1. Why await the database call?**  
It waits for the database operation to finish before the next dependent step runs.

**2. What is SQL injection and how do placeholders prevent it?**  
SQL injection is when malicious input changes a SQL query. Parameterized queries keep user input separate from SQL code.

**3. When is PUT used instead of POST?**  
POST creates a new resource. PUT updates an existing resource identified by its URL.
