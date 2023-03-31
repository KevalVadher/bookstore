const Book = require("../../models/book.model")
const moment = require('moment')

async function getBooks(req, res) {

    const limit = req.query.limit || 20
    const page = Math.max(0, req.query.page - 1)
    const skip = limit * page

    let binding = req.query.binding ? req.query.binding.split(',') : []
    let sortby = req.query.sortby

    const books = await Book.getBooks(binding, sortby, false, limit, skip)
    const totalBooks = await Book.getBooks(binding, sortby, true)

    res.send({
        error: false,
        data: {
            totalBooks,
            books
        }
    })

}

async function getBookByISBN13(req, res) {

    const isbn_13 = req.params.isbn_13

    const book = await Book.find({isbn_13: isbn_13, visibility: true})

    res.send({
        error: false,
        data: {
            book
        }
    })

}

async function searchBooks(req, res) {

    const limit = req.query.limit || 10
    const searchText = req.query.search || ''

    const books = await Book.search(searchText, limit)

    res.send({
        error: false,
        data: {
            books
        }
    })
}

async function getFilters(req, res) {

    let filters = {
        "price_range": {
            "heading": 'Price Range',
            "start": 0,
            "end": 5000
        },
        "discount_range": {
            "heading": 'Discount Range',
            "start": 0,
            "end": 80
        },
        "binding": {
            "heading": "Binding",
            "list": [
                { "name": "Paper Back", "code": "PAPERBACK" },
                { "name": "Hard Cover", "code": "HARDCOVER" },
                { "name": "Other", "code": "OTHER" }
            ]
        },
        "language": {
            "heading": "Language",
            "list": [
                { "name": "English", "code": "english" },
                { "name": "Marathi", "code": "marathi" },
                { "name": "Hindi", "code": "hindi" }
            ]
        }
    }

    res.send({
        error: false,
        data: {
            filters
        }
    })
}


module.exports = {
    getBooks,
    getBookByISBN13,
    searchBooks,
    getFilters
}

// let bookList = require('./books.json')
// bookList.books.forEach(book => {
//     book.released_date = new Date(moment(book.released_date, 'DD/MM/YYYY').format('YYYY-MM-DD'))
//     Book.create(book).then(() => console.log('book created'))
// });