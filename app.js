const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const mapsRoutes = require('./routes/maps-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')

require('dotenv').config()

const app = express()

app.use(express.json())

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	)
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

	next()
})

app.use('/api/maps', mapsRoutes)

app.use('/api/users', usersRoutes)

app.use((res, req, next) => {
	const error = new HttpError('invalid route', 404)
	return next(error)
})

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error)
	}
	res.status(error.code || 500)
	res.json({ message: error.message || 'An unknown error occured' })
})

mongoose
	.connect(
		`mongodb+srv://Andonee:${process.env.MONGO_API_KEY}@cluster0.aaqlo.mongodb.net/maps?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
	)
	.then(() => app.listen(5000))
	.catch((err) => console.log(err))
