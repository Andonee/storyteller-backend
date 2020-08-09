const express = require('express')

const mapsRouters = require('./routes/maps-route')
const HttpError = require('./models/http-error')

const app = express()

app.use(express.json())

app.use('/api/maps', mapsRouters)

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
