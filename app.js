const cors = require('cors')
const express = require('express')
const app = express()
const indexRouter = require('./modules/route')

require('./scheduler/scheduler')

app.use(cors())
app.use(express.json())

app.use('/api', indexRouter)

module.exports = app;