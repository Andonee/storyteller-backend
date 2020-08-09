const express = require('express')

const mapsRoutes = require('./routes/maps-route')
const usersRoutes = require('./routes/users.route')
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

app.listen(5000)
