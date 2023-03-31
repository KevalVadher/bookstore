const BookModel = require('../../models/book.model')
const OrderModel = require("../../models/order.model")
const ObjectId = require('mongoose').Types.ObjectId;
const uniqid = require('uniqid');
const Razorpay = require('razorpay');
const moment = require('moment')

function isValidObjectId(id){
     
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;       
        return false;
    }
    return false;
}

async function getOrders(req, res) {

    const userId = req.user.id
    
    let orders = await OrderModel.find({
        userId: userId,
        status: { $in: ["INITIATED", "CONFIRMED"] }
    })
    .sort({created_at: -1})

    res.send({
        error: false,
        data: {
            orders: orders
        }
    })
}

async function initOrder(req, res) {

    const userId = req.user.id
    const books = req.body.books
    const callbackUrl = req.body.callbackUrl || `http://localhost:3001/my-orders`

    let bookIds = []
    for(book of books) {
        if(isValidObjectId(book.bookId)) {
            bookIds.push(book.bookId) 
        } else {
            res.send({
                error: true,
                message: "Invalid book id"
            })
            return
        }
    }

    let existingBooks = await BookModel.getBooksByIds(bookIds)

    if(existingBooks.length !== books.length) {
        res.send({
            error: true,
            message: "Book Id not found"
        })
        return
    }

    const orderId = uniqid('order_')

    let totalPrice = 0
    let bookDetails = []
    existingBooks.forEach(book => {
        const quantity = books.find(b => b.bookId === book.id).quantity
        totalPrice += book.price * quantity

        bookDetails.push({
            bookId: book.id,
            price: book.price,
            name: book.name,
            img_url: book.img_url,
            quantity
        })
    })

    let orderDetails = {
        orderId,
        userId,
        bookDetails,
        totalPrice,
        status: 'INITIATED'
    }

    let order = await OrderModel.create(orderDetails)

    var instance = new Razorpay({ key_id: 'rzp_test_b8VuDoBtxUzl2U', key_secret: 'rOUCi9EWknJ8dnRa032zppcY' })

    const expiredTime = Math.floor(Date.now() / 1000) + (16 * 60);

    try {
        const paymentLink = await instance.paymentLink.create({
            amount: order.totalPrice * 100,
            currency: "INR",
            accept_partial: false,
            description: "Books purchase",
            customer: {
              name: "Tejas Desai",
              email: "tejasdesai0531@gmail.com",
              contact: "+918652801993"
            },
            notify: {
              sms: false,
              email: false
            },
            reminder_enable: false,
            notes: {
              orderId: order.orderId
            },
            callback_url: callbackUrl,
            callback_method: "get",
            expire_by: expiredTime
        })
        
        res.send({
            error: false,
            message: "Order Initiated",
            data: {
                paymentLink: paymentLink.short_url,
                callbackUrl
            }
        })
    } catch (error) {
        res.send({
            error: true,
            message: error,
        })
    }
}


module.exports = {
    getOrders,
    initOrder
}