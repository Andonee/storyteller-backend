const HttpError = require('../models/http-error')
const User = require('../models/user')

const DUMMY_USERS = [
	{
		id: 'u1',
		name: 'John Doe',
		email: 'john@doe.com',
		password: 'test123',
	},
]

const getUsers = (req, res) => {
	res.json({ users: DUMMY_USERS })
}

const signup = async (req, res, next) => {
	const { name, email, password, maps, image } = req.body

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
		maps,
	})

	try {
		await createdUser.save()
	} catch (err) {
		const error = new HttpError('Signing up failed. Try again.', 500)
		return next(error)
	}

	res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

const login = (req, res, next) => {
	const { email, password } = req.body

	const identifiedUser = DUMMY_USERS.find((u) => u.email === email)

	if (!identifiedUser || identifiedUser.password !== password) {
		return next(new HttpError('Wrong login or email. Try again.', 401))
	}

	res.json({ message: 'Logged in' })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
