const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mapSchema = new Schema({
	title: { type: String },
	description: { type: String },
	places: { type: Array, required: true },
	owner: { type: String, required: true },
})

// Not sure for solution below.

// const mapSchema = new Schema({
// 	data: {
//     type: 'Feature',
//     properties: {
//       Place: { type: String},
//       Description: {type: String},
//       Image: {type: String}
//     },
//     geometry: {
//       type: 'Point',
//       coordinates: {
//         lat: { type: Number, required: true},
//         lng: { type: Number, required: true}
//       }
//     }
//   },
// 	creator: { type: String, required: true },
// })

module.exports = mongoose.model('Map', mapSchema)
