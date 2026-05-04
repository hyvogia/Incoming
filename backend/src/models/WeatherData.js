const mongoose = require('mongoose')

const currentWeatherSchema = new mongoose.Schema(
  {
    temperature: { type: Number, required: true },
    feelsLike: { type: Number },
    dewPoint: { type: Number },
    condition: { type: String, required: true },
    windSpeed: { type: Number },
    windGust: { type: Number },
    humidity: { type: Number },
    pressure: { type: Number },
    rain: { type: Number },
    sunrise: { type: String },
    sunset: { type: String },
  },
  { _id: false },
)

const forecastDaySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    condition: { type: String, required: true },
    high: { type: Number },
    low: { type: Number },
    windSpeed: { type: Number },
    precipitation: { type: Number },
  },
  { _id: false },
)

const observationSchema = new mongoose.Schema(
  {
    stationName: { type: String, required: true },
    temperature: { type: Number },
    condition: { type: String },
    windSpeed: { type: Number },
    humidity: { type: Number },
    pressure: { type: Number },
    visibility: { type: Number },
    observedAt: { type: Date },
  },
  { _id: false },
)

const radarSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['available', 'unavailable'], default: 'unavailable' },
    provider: { type: String },
    attribution: { type: String },
    frameTime: { type: String },
    generatedAt: { type: String },
    zoom: { type: Number },
    tileX: { type: Number },
    tileY: { type: Number },
    baseMapTileUrl: { type: String },
    radarTileUrl: { type: String },
    message: { type: String },
  },
  { _id: false },
)

const weatherDataSchema = new mongoose.Schema(
  {
    location: {
      name: { type: String, required: true },
      region: { type: String },
      country: { type: String, default: 'US' },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    current: { type: currentWeatherSchema, required: true },
    forecast: { type: [forecastDaySchema], default: [] },
    observations: { type: [observationSchema], default: [] },
    radar: { type: radarSchema },
    provider: { type: String, default: 'mock' },
    observedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  },
)

weatherDataSchema.index({ 'location.name': 1, 'location.region': 1, provider: 1 })
weatherDataSchema.index({ expiresAt: 1 })

module.exports = mongoose.model('WeatherData', weatherDataSchema)
