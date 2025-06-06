const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
   const { username, password } = req.body;
   if (!username || !password) {
     return res
       .status(400)
       .json({ message: "Username and password are required" });
   }
   const existingUser = users.find((user) => user.username === username);
   if (existingUser) {
     return res.status(409).json({ message: "User already exists" });
   }
   users.push({ username, password });
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
    return res.status(300).json({ message: "Yet to be implemented" });
    }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const results = Object.values(books).filter((book) => book.author === author);
  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(300).json({ message: "Yet to be implemented" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    const results = Object.values(books).filter((book) => book.title === title);
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(300).json({ message: "Yet to be implemented" });
    }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
   const book = books[isbn];

   if (book && book.reviews) {
     return res.status(200).json(book.reviews);
   } else {
     return res.status(404).json({ message: "No reviews found for this book" });
   }
 
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: "Not logged in" });
  }

  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports.general = public_users;


function getAllBooksCallback(callback) {
    setTimeout(() => {
        callback(null, books);
    }, 1000); // จำลองความล่าช้า 1 วินาที
}


public_users.get('/callback/books', (req, res) => {
    getAllBooksCallback((err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching books" });
        } else {
            return res.status(200).json(result);
        }
    });
});

// ฟังก์ชันคืน Promise ที่ค้นหาหนังสือตามผู้แต่ง
function findBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchedBooks = Object.values(books).filter(
                (book) => book.author.toLowerCase() === author.toLowerCase()
            );
            if (matchedBooks.length > 0) {
                resolve(matchedBooks);
            } else {
                reject("No books found for this author");
            }
        }, 500); // จำลอง delay
    });
}

// Route: /promise/author/:author
public_users.get('/promise/author/:author', (req, res) => {
    const author = req.params.author;

    findBooksByAuthor(author)
        .then((booksByAuthor) => {
            res.status(200).json(booksByAuthor);
        })
        .catch((err) => {
            res.status(404).json({ message: err });
        });
});

// ฟังก์ชัน async สำหรับค้นหาหนังสือตาม title
async function findBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchedBooks = Object.values(books).filter(
                (book) => book.title.toLowerCase() === title.toLowerCase()
            );
            if (matchedBooks.length > 0) {
                resolve(matchedBooks);
            } else {
                reject("No books found with this title");
            }
        }, 500); // จำลอง delay
    });
}

// Route: /async/title/:title
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const result = await findBooksByTitle(title);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});
