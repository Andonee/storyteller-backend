const express = require('express')

const mapsController = require('../controllers/maps-controller')

const router = express.Router()

router.get('/:mapId', mapsController.getMapById)

router.get('/user/:userId', mapsController.getPlaceByUserId)

router.post('/', mapsController.createMap)

module.exports = router
