var express = require('express');
var router = express.Router();


const orderController = require('./orders.controller')

router.get('/myorders', orderController.getOrders)
router.post('/initOrder', orderController.initOrder)

module.exports = router;