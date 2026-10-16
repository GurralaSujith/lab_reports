const express = require("express");
const app = express();

app.get("/", (request, response) => {
  response.send("Welcome to the Node.js and Express server!");
});

app.get("/about", (request, response) => {
  response.json({
    name: "GURRALA SUJITH",
    section: "CSE GEN AI 2A",
  });
});

app.get("/time", (request, response) => {
  const date = new Date().toString();
  response.send(date);
});

app.use((request, response) => {
  response.send("404 - Page not found");
});

app.listen(3000);

module.exports = app;
