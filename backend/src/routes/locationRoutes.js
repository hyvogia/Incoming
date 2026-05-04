const express = require('express')
const { searchLocationMatches } = require('../controllers/locationController')

const router = express.Router()

router.get('/search', searchLocationMatches)

module.exports = router
