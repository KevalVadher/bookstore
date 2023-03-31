const jwt = require('jsonwebtoken')

async function authCheck(req, res, next) {

    try {
        const payload = jwt.verify(
            req.headers.token,
            'secret'
        )
        req.user = payload
        next()
    } catch (error) {
        res.send({
            error: true,
            message: "Invalid token"
        })
    }
}

module.exports = {
    authCheck
}