const HttpError = require('../models/http-error')

const Map = require('../models/maps')

let DEMO_MAPS = [
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
		creator: 'user1',
	},
]

const getMapById = async (req, res, next) => {
	const mapId = req.params.mapId

	let map

	try {
		map = await Map.findById(mapId)
	} catch (err) {
		const error = new HttpError('Something went wrong. Try again.', 500)
		return next(error)
	}
	if (!map) {
		const error = new HttpError('Could not find map for privided id', 404)
		return next(error)
	}

	res.json({ map: map.toObject({ getters: true }) })
}

const getMapsByUserId = async (req, res, next) => {
	const userId = req.params.userId

	let maps

	try {
		maps = await Map.find({ owner: userId })
	} catch (err) {
		const error = new HttpError('Something went wrong. Try again', 404)
		return next(error)
	}

	if (!maps || maps.length === 0) {
		return next(new HttpError('Could not find maps for privided user id', 404))
	}

	res.json({ maps: maps.map((map) => map.toObject({ getters: true })) })
}

const createMap = async (req, res, next) => {
	// I need to prepare valid geojson structure in the front-end app and then pass it as "places" array
	const { places, title, description, owner } = req.body
	// const createdMap = {
	// 	id: 'map2',
	// 	data: places,
	// 	title,
	// 	description,
	// }
	const createdMap = new Map({
		title, // titile: titile
		description,
		places,
		owner,
	})

	try {
		await createdMap.save()
	} catch (err) {
		const error = new HttpError('Creating map failed. Try again.', 500)
		return next(error)
	}

	res.status(201).json({ place: createdMap })
}

const updateMap = async (req, res, next) => {
	const { places } = req.body
	const mapId = req.params.mapId

	let map

	try {
		map = await Map.findById(mapId)
	} catch (err) {
		const error = new HttpError('Something went wrong. Try again', 500)
		return next(error)
	}

	places.map((place) => {
		map.places.push(place)
	})

	try {
		await map.save()
	} catch (err) {
		const error = new HttpError('Something went wrong. Try again', 500)
		return next(error)
	}

	res.status(200).json({ map: map.toObject({ getters: true }) })
}

const deleteMap = async (req, res, next) => {
	const mapId = req.params.mapId

	let map

	try {
		map = await Map.findById(mapId)
	} catch (err) {
		const error = new HttpError('Something went wrong. Try again', 500)
		return next(error)
	}

	try {
		await map.remove()
	} catch (err) {
		const error = new HttpError('Something went wrong. Try again', 500)
		return next(error)
	}

	res.status(200).json({ message: 'Deleted map.' })
}

exports.getMapById = getMapById
exports.getMapsByUserId = getMapsByUserId
exports.createMap = createMap
exports.updateMap = updateMap
exports.deleteMap = deleteMap
