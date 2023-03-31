var express = require('express');
var router = express.Router();


const bookController = require('./books.controller')

router.get('/', bookController.getBooks)
router.get('/detail/:isbn_13', bookController.getBookByISBN13)
router.get('/search', bookController.searchBooks)
router.get('/filter/list', bookController.getFilters)

module.exports = router;