const WeatherData = require('../models/WeatherData')
const { fetchRadarMetadata } = require('../services/radarService')
const { fetchLiveWeather } = require('../services/openMeteoService')

const mockWeather = {
  location: {
    name: 'Fairfield',
    region: 'Iowa',
    country: 'US',
    latitude: 41.0076,
    longitude: -91.9637,
  },
  current: {
    temperature: 48,
    feelsLike: 45,
    dewPoint: 43,
    condition: 'Clear',
    windSpeed: 9,
    windGust: 13,
    humidity: 81,
    pressure: 29.6,
    rain: 0,
    sunrise: '6:02 AM',
    sunset: '8:07 PM',
  },
  forecast: [
    { day: 'Mon', condition: 'Partly cloudy', high: 81, low: 46, windSpeed: 9, precipitation: 0.01 },
    { day: 'Tue', condition: 'Cloudy', high: 59, low: 46, windSpeed: 9, precipitation: 0 },
    { day: 'Wed', condition: 'Cloudy', high: 55, low: 39, windSpeed: 7, precipitation: 0 },
    { day: 'Thu', condition: 'Partly cloudy', high: 61, low: 37, windSpeed: 7, precipitation: 0.01 },
    { day: 'Fri', condition: 'Partly cloudy', high: 66, low: 46, windSpeed: 7, precipitation: 0 },
  ],
  observations: [
    { stationName: 'Mount Pleasant Municipal Airport', temperature: 45, condition: 'Clear', windSpeed: 7, humidity: 87, pressure: 29.7, visibility: 10 },
    { stationName: 'Washington', temperature: 45, condition: 'Clear', windSpeed: 7, humidity: 100, pressure: 29.6, visibility: 2 },
    { stationName: 'Ottumwa Industrial Airport', temperature: 48, condition: 'Clear', windSpeed: 4, humidity: 71, pressure: 29.6, visibility: 10 },
  ],
  provider: 'mock',
}

async function getWeatherSummary(req, res, next) {
  try {
    const location = req.query.location || 'Fairfield, Iowa'
    const liveCache = await WeatherData.findOne({
      'location.name': /fairfield/i,
      provider: 'open-meteo',
      expiresAt: { $gt: new Date() },
    }).lean()

    if (liveCache) {
      return res.json({
        data: liveCache,
        meta: {
          location,
          source: 'mongodb-cache',
        },
      })
    }

    const liveWeather = await fetchLiveWeather()
    liveWeather.radar = await fetchRadarMetadata(liveWeather.location)
    const weather = await WeatherData.findOneAndUpdate(
      { 'location.name': liveWeather.location.name, 'location.region': liveWeather.location.region, provider: 'open-meteo' },
      liveWeather,
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean()

    res.json({
      data: weather,
      meta: {
        location,
        source: 'open-meteo',
      },
    })
  } catch (error) {
    next(error)
  }
}

async function seedMockWeather(req, res, next) {
  try {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15)
    const weather = await WeatherData.findOneAndUpdate(
      { 'location.name': mockWeather.location.name, 'location.region': mockWeather.location.region, provider: 'mock' },
      { ...mockWeather, observedAt: new Date(), expiresAt },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )

    res.status(201).json({
      data: weather,
      meta: {
        source: 'mongodb',
        seeded: true,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getWeatherSummary,
  seedMockWeather,
}
