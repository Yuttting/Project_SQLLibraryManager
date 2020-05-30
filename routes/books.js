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
        }
    }
}

//get / - Home route should redirect to the /books route.
router.get('/', (req, res, next) => {
    res.redirect('/books')
});

//get /books - Shows the full list of books.
router.get('/books', asyncHandler(async(req, res) => {
    const books = await Book.findAll({ order: [["createdAt", "DESC"]]});
    res.render("books/index", {books, title: "Books"});
}));

//get /books/new - Shows the create new book form.
router.get('/books/new', (req, res) => {
    render('books/new', { book: {}, title: "New Book"});
})

//post /books/new - Posts a new book to the database.
router.post()

//get /books/:id - Shows book detail form.
//post /books/:id - Updates book info in the database.
//post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.