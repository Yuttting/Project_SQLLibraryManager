const express = require('express');
const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

app.use('/', routes);
app.use('/books', books);

module.exports = app;