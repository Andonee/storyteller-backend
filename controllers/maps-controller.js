const HttpError = require('../models/http-error')

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

const getMapById = (req, res, next) => {
	const mapId = req.params.mapId
	const map = DEMO_MAPS.find((m) => {
		return m.id === mapId
	})

	if (!map) {
		return next(new HttpError('Could not find map for privided id', 404))
	}

	res.json({ map: map })
}

const getPlaceByUserId = (req, res, next) => {
	const userId = req.params.userId
	const user = DEMO_MAPS.find((u) => {
		return u.creator === userId
	})

	if (!user) {
		return next(new HttpError('Could not find map for privided user id', 404))
	}

	res.json({ user: user })
}

exports.getMapById = getMapById
exports.getPlaceByUserId = getPlaceByUserId
