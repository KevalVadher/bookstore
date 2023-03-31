const Razorpay = require("razorpay");
const Order = require('../../models/order.model')

async function razorpayWebhook(req, res) {

    console.log(req.body.payload.payment.entity)

    let body = req.body;
    let received_signature = req.headers["x-razorpay-signature"];
    const secret = 'rOUCi9EWknJ8dnRa032zppcY'

    var isValid = Razorpay.validateWebhookSignature(
      JSON.stringify(body),
      received_signature,
      secret
    );

    if (!isValid) {
        console.log("Invalid signature");
        res.json({status: 'ok'})
        return
    }

    let orderId = body.payload.payment.entity.notes.orderId

    let order = await Order.findOne({orderId: orderId})

    order.status = 'CONFIRMED'

    await order.save()

    res.json({status: 'ok'})

}

module.exports = razorpayWebhook