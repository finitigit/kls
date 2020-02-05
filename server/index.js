'use strict'
require('./config')

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = express()

app.use(require('cors')())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, '../public')))
app.use('/model', express.static(path.join(__dirname, '../public2')))

require('./router')(app)
app.use('*', express.static('public/client/'))

app.listen(config.port, log(`Server is running...  Port: ${config.port} , Env: ${config.env}`))