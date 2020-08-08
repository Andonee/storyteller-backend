const express = require('express')

const mapsRouters = require('./routes/maps-route')

const app = express()

app.use('/api/maps', mapsRouters)

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error)
	}
	res.status(error.code || 500)
	res.json({ message: error.message || 'An unknown error occured' })
})

app.listen(5000)
