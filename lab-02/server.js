const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
const PORT = process.env.PORT || 3000;
let db;

async function initializeDBAndServer() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      )
    `);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to SQLite:", error.message);
    process.exit(1);
  }
}

app.get("/books/", async (req, res) => {
  try {
    const books = await db.all("SELECT * FROM book ORDER BY id");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch books" });
  }
});

app.get("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await db.get("SELECT * FROM book WHERE id = ?", [bookId]);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch book" });
  }
});

app.post("/books/", async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;
    if (!title || !author || price === undefined || pages === undefined) {
      return res.status(400).json({
        error: "title, author, price and pages are required"
      });
    }

    const result = await db.run(
      "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
      [title, author, price, pages]
    );
    res.status(201).json({
      message: "Book added successfully",
      bookId: result.lastID
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to add book" });
  }
});

app.put("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, price, pages } = req.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return res.status(400).json({
        error: "title, author, price and pages are required"
      });
    }

    const result = await db.run(
      "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?",
      [title, author, price, pages, bookId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to update book" });
  }
});

app.delete("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;
    const result = await db.run("DELETE FROM book WHERE id = ?", [bookId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete book" });
  }
});

initializeDBAndServer();
