const HttpError = require('../models/http-error')

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

const signup = (req, res) => {
	const { name, email, password } = req.body

	const hasUser = DUMMY_USERS.find((u) => u.email === email)

	if (hasUser) {
		throw new HttpError('Email is already used.', 422)
	}

	const createdUser = {
		id: Math.floor(Math.random() * 100000),
		name,
		email,
		password,
	}

	DUMMY_USERS.push(createdUser)

	res.status(201).json({ user: createdUser })
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
