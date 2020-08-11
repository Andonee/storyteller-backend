const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const mapsRoutes = require('./routes/maps-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')

const app = express()

app.use(express.json())

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
		`mongodb+srv://Andonee:${process.env.MONGO_API_KEY}@cluster0-16jgm.mongodb.net/maps?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => app.listen(5000))
	.catch((err) => console.log(err))
