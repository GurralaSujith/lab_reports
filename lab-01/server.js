const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
  response.status(200).send('Welcome to the Node.js and Express server!');
});

app.get('/about', (request, response) => {
  response.status(200).json({
    name: 'Your Name',
    section: 'Your Section'
  });
});

app.get('/time', (request, response) => {
  response.status(200).send(new Date().toString());
});

app.use((request, response) => {
  response.status(404).send('404 - Page not found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
