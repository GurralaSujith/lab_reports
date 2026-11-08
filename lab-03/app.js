const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'books.db')
let db = null

const startServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    await db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price REAL NOT NULL
      );
    `)

    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000')
    })
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

// GET /books - search, sort, filter and pagination
app.get('/books', async (req, res) => {
  const {
    search_q = '',
    order_by = 'title',
    order = 'ASC',
    limit = '10',
    offset = '0',
    min_price,
    max_price
  } = req.query

  // Only allow these column names for sorting.
  const allowedColumns = ['id', 'title', 'author', 'price']
  const sortColumn = allowedColumns.includes(order_by) ? order_by : 'title'
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

  let query = 'SELECT * FROM books WHERE title LIKE ?'
  const values = [`%${search_q}%`]

  if (min_price !== undefined && max_price !== undefined) {
    query += ' AND price BETWEEN ? AND ?'
    values.push(Number(min_price), Number(max_price))
  } else if (min_price !== undefined) {
    query += ' AND price >= ?'
    values.push(Number(min_price))
  } else if (max_price !== undefined) {
    query += ' AND price <= ?'
    values.push(Number(max_price))
  }

  query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`
  values.push(Number(limit), Number(offset))

  const books = await db.all(query, values)
  res.status(200).send(books)
})

// GET /books/:bookId - get one book
app.get('/books/:bookId', async (req, res) => {
  const {bookId} = req.params
  const book = await db.get('SELECT * FROM books WHERE id = ?', [bookId])

  if (book === undefined) {
    res.status(404).send({message: 'Book not found'})
  } else {
    res.status(200).send(book)
  }
})

// POST /books - create a book
app.post('/books', async (req, res) => {
  const {title, author, price} = req.body

  if (
    title === undefined || title.trim() === '' ||
    author === undefined || author.trim() === '' ||
    price === undefined || price === '' || Number.isNaN(Number(price))
  ) {
    res.status(400).send({
      message: 'title, author and a numeric price are required'
    })
    return
  }

  await db.run(
    'INSERT INTO books (title, author, price) VALUES (?, ?, ?)',
    [title, author, Number(price)]
  )

  res.status(201).send({message: 'Book Created'})
})

// PUT /books/:bookId - update a book
app.put('/books/:bookId', async (req, res) => {
  const {bookId} = req.params
  const {title, author, price} = req.body

  const existingBook = await db.get('SELECT * FROM books WHERE id = ?', [bookId])

  if (existingBook === undefined) {
    res.status(404).send({message: 'Book not found'})
    return
  }

  if (title === undefined && author === undefined && price === undefined) {
    res.status(400).send({message: 'Provide title, author or price to update'})
    return
  }

  if (price !== undefined && (price === '' || Number.isNaN(Number(price)))) {
    res.status(400).send({message: 'price must be a number'})
    return
  }

  const newTitle = title === undefined ? existingBook.title : title
  const newAuthor = author === undefined ? existingBook.author : author
  const newPrice = price === undefined ? existingBook.price : Number(price)

  await db.run(
    'UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?',
    [newTitle, newAuthor, newPrice, bookId]
  )

  res.status(200).send({message: 'Book Updated'})
})

// DELETE /books/:bookId - delete a book
app.delete('/books/:bookId', async (req, res) => {
  const {bookId} = req.params
  const result = await db.run('DELETE FROM books WHERE id = ?', [bookId])

  if (result.changes === 0) {
    res.status(404).send({message: 'Book not found'})
  } else {
    res.status(200).send({message: 'Book Deleted'})
  }
})

// Handle unknown routes
app.use((req, res) => {
  res.status(404).send({message: 'Route not found'})
})

startServer()

module.exports = app
