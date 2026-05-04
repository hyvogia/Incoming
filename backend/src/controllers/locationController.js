const { searchLocations } = require('../services/locationSearchService')

async function searchLocationMatches(req, res, next) {
  try {
    const query = String(req.query.query || '')
    const locations = await searchLocations(query)

    res.json({
      data: locations,
      meta: {
        query,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  searchLocationMatches,
}
