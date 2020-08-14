const mongoose = require('mongoose')
const HttpError = require('../models/http-error')

const Map = require('../models/map')
const User = require('../models/user')

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

	const createdMap = new Map({
		title, // titile: titile
		description,
		places,
		owner,
	})

	let user

	try {
		user = await User.findById(owner)
	} catch (err) {
		const error = new HttpError('Creating map failed. Try again', 500)
		return next(error)
	}

	if (!user) {
		const error = new HttpError('There is no user with provided id.', 404)
		return next(error)
	}

	try {
		const session = await mongoose.startSession()
		session.startTransaction()
		await createdMap.save({ session: session })
		user.maps.push(createdMap)
		await user.save({ session: session })
		// If everything above goes fine in this place changes are save
		await session.commitTransaction()
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
		map = await Map.findById(mapId).populate('owner')
	} catch (err) {
		const error = new HttpError('Something went wrong. Try again', 500)
		return next(error)
	}

	if (!map) {
		const error = new HttpError(
			'Could not find map for this id. Try again',
			404
		)
		return next(error)
	}

	try {
		const session = await mongoose.startSession()
		session.startTransaction()
		await map.remove({ session: session })
		map.owner.maps.pull(map)
		await map.owner.save({ session: session })
		await session.commitTransaction()
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
