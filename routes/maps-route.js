const express = require('express')

const mapsController = require('../controllers/maps-controller')

const router = express.Router()

router.get('/:mapId', mapsController.getMapById)

router.get('/user/:userId', mapsController.getMapsByUserId)

router.post('/', mapsController.createMap)

router.patch('/:mapId', mapsController.updateMap)

router.delete('/:mapId', mapsController.deleteMap)

module.exports = router
