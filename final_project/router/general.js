const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (doesExist(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res
    .status(200)
    .json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  //   return res.status(300).json({message: "Yet to be implemented"});
  res.setHeader("Content-Type", "application/json"); // необов’язково, але чітко вказує тип
  res.send(JSON.stringify(books, null, 2)); // 2 — для краси (відступи)
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.status(200).json(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found for the given ISBN" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  const filteredBooks = [];

  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
      filteredBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (filteredBooks.length > 0) {
    res.status(200).json(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found for the given author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const filteredBooks = [];

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
      filteredBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (filteredBooks.length > 0) {
    res.status(200).json(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found with the given title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];
  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// =======================
// Task 10 — Get all books
// =======================

// Promise with then/catch
function getBooksPromise() {
  axios
    .get("http://localhost:5000/")
    .then((response) => {
      console.log("Books using Promise:");
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error fetching books:", error.message);
    });
}

// Async/Await
async function getBooksAsync() {
  try {
    const response = await axios.get("http://localhost:5000/");
    console.log("Books using Async/Await:");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

// ============================
// Task 11 — Get book by ISBN
// ============================
function getBookByISBN(isbn) {
  axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      console.log(`Book with ISBN ${isbn}:`);
      console.log(response.data);
    })
    .catch((error) => {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
    });
}

// ============================
// Task 12 — Get books by Author
// ============================
function getBooksByAuthor(author) {
  axios
    .get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
    .then((response) => {
      console.log(`Books by author "${author}":`);
      console.log(response.data);
    })
    .catch((error) => {
      console.error(
        `Error fetching books by author "${author}":`,
        error.message
      );
    });
}

// ============================
// Task 13 — Get books by Title
// ============================
function getBooksByTitle(title) {
  axios
    .get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
    .then((response) => {
      console.log(`Books with title "${title}":`);
      console.log(response.data);
    })
    .catch((error) => {
      console.error(
        `Error fetching books with title "${title}":`,
        error.message
      );
    });
}

module.exports.general = public_users;

getBooksPromise(); // Task 10
getBookByISBN(3); // Task 11
getBooksByAuthor("Jane Austen"); // Task 12
getBooksByTitle("Pride and Prejudice"); // Task 13
