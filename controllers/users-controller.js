const HttpError = require('../models/http-error')
const User = require('../models/user')

const getUsers = async (req, res, next) => {
	let users

	try {
		users = await User.find({}, 'email name') // Which fields I want to get in response
	} catch (err) {
		const error = new HttpError('Getting users failed. Try again', 500)
		return next(error)
	}
	res.json({ users: users.map((user) => user.toObject({ getters: true })) })
}

const signup = async (req, res, next) => {
	const { name, email, password, image } = req.body

	let userExist
	try {
		userExist = await User.findOne({ email: email })
	} catch (err) {
		const error = new HttpError('Signing up failed. Try again', 500)
		return next(error)
	}

	if (userExist) {
		const error = new HttpError(
			'The e-mail address is already taken. Please choose another one.',
			422
		)
		return next(error)
	}

	const createdUser = new User({
		name,
		email,
		password,
		image: 'https://randomuser.me/api/portraits/men/55.jpg',
		maps: [],
	})

	try {
		await createdUser.save()
	} catch (err) {
		const error = new HttpError('Signing up failed. Try again.', 500)
		return next(error)
	}

	res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

const login = async (req, res, next) => {
	const { email, password } = req.body

	let userExist
	try {
		userExist = await User.findOne({ email: email })
	} catch (err) {
		const error = new HttpError('Logging in failed. Try again', 500)
		return next(error)
	}

	if (!userExist || userExist.password !== password) {
		const error = new HttpError('Invalid login or password. Try again', 401)
		return next(error)
	}

	res.json({ message: 'Logged in' })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
