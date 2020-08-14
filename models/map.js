const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mapSchema = new Schema({
	title: { type: String },
	description: { type: String },
	places: { type: Array, required: true },
	owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
})

module.exports = mongoose.model('Map', mapSchema)
