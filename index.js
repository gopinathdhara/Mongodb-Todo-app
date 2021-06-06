const express = require('express')
require('./db/mongoose')
const myUserRouter = require('./routers/myuser')
const myTaskRouter = require('./routers/task')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
//app.use(userRouter)
app.use('/todoappapi',myUserRouter)
app.use('/todoappapi',myTaskRouter)
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

