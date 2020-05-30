const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// Handler function to wrap each route.
function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        } catch(error) {
            res.statur(500).send(error);
            console.log("Error: ", error);
        }
    }
};


//get /books - Shows the full list of books.
router.get('/books', asyncHandler(async(req, res) => {
    const books = await Book.findAll({ order: [["createdAt", "DESC"]]});
    res.render("books/index", {books, title: "Books"});
}));

//get /books/new - Shows the create new book form.
router.get('/books/new', (req, res) => {
    render('books/new-book', { book: {}, title: "New Book"});
});

//post /books/new - Posts a new book to the database.
router.post('/', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/books/' + book.id);
    } catch(error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            res.render("books/new-book", {book, errors: error.errors, title: "New Book"})
        } else {
            throw error;
        }
    }
}));

//get /books/:id - Shows book detail form.
router.get('/books/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        res.render("books/update-book", {book, title: book.title})
    } else {
        res.sendStatus(404);
    }
}));

//post /books/:id - Updates book info in the database.
router.post('/books/:id/edit', asyncHandler(async (req,res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if(book) {
            await book.update(req.body);
            res.redirect("/books/" + book.id);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render("books/edit", {book, errors:error.errors, title: "Edit Book"});
        } else {
            throw error;
        }
    }
}));

//post /books/:id/delete - Deletes a book. Careful, this can’t be undone. 
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        await book.destroy();
        res.redirect("/books");
    } else {
        res.sendStatus(404);
    }
}))

module.exports = router;