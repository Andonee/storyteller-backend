const express = require('express')

const router = express.Router()

const DEMO_MAPS = [
	{
		id: 'map1',
		type: 'Feature',
		properties: {
			id: 2,
			Place: 'Palatine hill',
			Description:
				'After visiting the Colosseum, admire the mesmerizing Palatine ruins . Roam the stunning Palatine hill, one of the most ancient parts of the city and the most central of the Seven Hills of Rome.',
			Photo:
				'https://wheretogoin.net/wp-content/uploads/2015/11/mercati-di-traiano-e1577983310241.jpg',
			Day: null,
		},
		geometry: {
			type: 'Point',
			coordinates: [12.487212272821868, 41.88921331680398],
		},
		creator: 'user1',
	},
]

router.get('/:mapId', (req, res, next) => {
	const mapId = req.params.mapId
	const map = DEMO_MAPS.find((m) => {
		return m.id === mapId
	})

	if (!map) {
		const error = new Error('Could not find map for privided id')
		error.code = 404
		return next(error)
	}

	res.json({ map: map })
})

router.get('/user/:userId', (req, res, next) => {
	const userId = req.params.userId
	const user = DEMO_MAPS.find((u) => {
		return u.creator === userId
	})

	if (!user) {
		const error = new Error('Could not find map for privided user id')
		error.code = 404
		return next(error)
	}

	res.json({ user: user })
})

module.exports = router
