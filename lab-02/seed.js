const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function seedDatabase() {
  const db = await open({
    filename: path.join(__dirname, "books.db"),
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

  const count = await db.get("SELECT COUNT(*) AS count FROM book");
  if (count.count === 0) {
    const books = [
      ["The Alchemist", "Paulo Coelho", 250, 208],
      ["Wings of Fire", "A. P. J. Abdul Kalam", 300, 180],
      ["Atomic Habits", "James Clear", 450, 320],
      ["The Hobbit", "J. R. R. Tolkien", 399, 310],
      ["Ikigai", "Hector Garcia", 280, 194],
      ["Deep Work", "Cal Newport", 350, 296],
      ["The Guide", "R. K. Narayan", 220, 224],
      ["1984", "George Orwell", 199, 328],
      ["Clean Code", "Robert C. Martin", 550, 464],
      ["Think Like a Monk", "Jay Shetty", 399, 288]
    ];
    for (const book of books) {
      await db.run(
        "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
        book
      );
    }
  }

  await db.close();
  console.log("Database ready with sample books.");
}

seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
