require('dotenv').config()
const express = require('express')
const cors = require('cors')
const upload = require('multer')()
const path = require('path')
const rootRouter = require('./rootRouter')
const app = express()

const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(upload.array('images'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')))

    app.get('/', (req, res, next) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
    })
}

app.use('/api', rootRouter)

app.listen(PORT, () => console.log(`Image resizer is running on port ${PORT}`))