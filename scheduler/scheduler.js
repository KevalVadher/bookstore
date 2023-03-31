const cron = require("node-cron");
const OrderModel = require('../models/order.model')


async function cancelledOldOrders() {

    console.log('Cancelled Order cron executed')

    let orders = await OrderModel.find({ 
        status: 'INITIATED',
        created_at: { // 20 minutes ago (from now)
            $lt: new Date().getTime()-(20*60*1000)
        }
    })

    for(let order of orders) {
        order.status = 'CANCELLED'
        order.save()
    }
}

cron.schedule("0 */2 * * * *", cancelledOldOrders);