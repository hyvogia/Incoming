const express = require('express')
const { getWeatherSummary, seedMockWeather } = require('../controllers/weatherController')

const router = express.Router()

router.get('/summary', getWeatherSummary)
router.post('/seed', seedMockWeather)

module.exports = router
