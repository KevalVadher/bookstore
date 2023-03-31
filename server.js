const mongoose = require('mongoose')
const config = require('./config/config')
const app = require('./app')
const port = 3000


mongoose.connect(config.DB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })


