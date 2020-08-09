const HttpError = require('../models/http-error')

const DEMO_MAPS = [
	{
		id: 'map1',
		data: [
			{
				type: 'Feature',
				properties: {
					id: 2,
					Place: 'Palatine hill',
					Description:
						'After visiting the Colosseum, admire the mesmerizing Palatine ruins . Roam the stunning Palatine hill, one of the most ancient parts of the city and the most central of the Seven Hills of Rome.',
					Photo:
						'https://wheretogoin.net/wp-content/uploads/2015/11/mercati-di-traiano-e1577983310241.jpg',
				},
				geometry: {
					type: 'Point',
					coordinates: [12.487212272821868, 41.88921331680398],
				},
			},
		],

		creator: 'user1',
	},
	{
		id: 'map4',
		data: [
			{
				type: 'Feature',
				properties: {
					id: 2,
					Place: 'HELENKA',
					Description:
						'After visiting the Colosseum, admire the mesmerizing Palatine ruins . Roam the stunning Palatine hill, one of the most ancient parts of the city and the most central of the Seven Hills of Rome.',
					Photo:
						'https://wheretogoin.net/wp-content/uploads/2015/11/mercati-di-traiano-e1577983310241.jpg',
				},
				geometry: {
					type: 'Point',
					coordinates: [12.487212272821868, 41.88921331680398],
				},
			},
		],
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

const createMap = (req, res) => {
	// I need to prepare valid geojson structure in the front-end app and then pass it as "places" array
	const { places } = req.body
	const createdMap = {
		id: 'map2',
		data: places,
	}

	DEMO_MAPS.push(createdMap)

	res.status(201).json({ place: createdMap })
}

const updateMap = (req, res, next) => {
	const { places } = req.body
	const mapId = req.params.mapId

	const updatedMap = { ...DEMO_MAPS.find((m) => m.id === mapId) }
	const mapIndex = DEMO_MAPS.findIndex((m) => m.id === mapId)
	// updatedMap.place = place
	// updatedMap.description = description

	places.map((place) => {
		updatedMap.data.push(place)
	})

	// updatedMap.data.push(places)

	DEMO_MAPS[mapIndex] = updatedMap

	res.status(200).json({ map: updatedMap })
}

exports.getMapById = getMapById
exports.getPlaceByUserId = getPlaceByUserId
exports.createMap = createMap
exports.updateMap = updateMap
