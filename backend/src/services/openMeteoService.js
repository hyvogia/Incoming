const FAIRFIELD = {
  name: 'Fairfield',
  region: 'Iowa',
  country: 'US',
  latitude: 41.0076,
  longitude: -91.9637,
  timezone: 'America/Chicago',
}

const weatherCodeLabels = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
}

function formatTime(value) {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function dayName(value) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: FAIRFIELD.timezone,
  }).format(new Date(`${value}T12:00:00`))
}

function pressureToInHg(value) {
  if (typeof value !== 'number') {
    return undefined
  }

  return Number((value * 0.02953).toFixed(1))
}

function getWeatherLabel(code) {
  return weatherCodeLabels[code] || 'Unknown'
}

function normalizeOpenMeteoResponse(payload) {
  const current = payload.current
  const daily = payload.daily
  const forecast = daily.time.map((date, index) => ({
    day: dayName(date),
    condition: getWeatherLabel(daily.weather_code[index]),
    high: Math.round(daily.temperature_2m_max[index]),
    low: Math.round(daily.temperature_2m_min[index]),
    windSpeed: Math.round(daily.wind_speed_10m_max[index]),
    precipitation: Number(daily.precipitation_sum[index].toFixed(2)),
  }))

  return {
    location: FAIRFIELD,
    current: {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      dewPoint: Math.round(current.dew_point_2m),
      condition: getWeatherLabel(current.weather_code),
      windSpeed: Math.round(current.wind_speed_10m),
      windGust: Math.round(current.wind_gusts_10m),
      humidity: current.relative_humidity_2m,
      pressure: pressureToInHg(current.pressure_msl),
      rain: Number((current.rain || current.precipitation || 0).toFixed(2)),
      sunrise: formatTime(daily.sunrise[0]),
      sunset: formatTime(daily.sunset[0]),
    },
    forecast,
    observations: [],
    provider: 'open-meteo',
    observedAt: new Date(current.time),
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
  }
}

async function fetchLiveWeather() {
  const params = new URLSearchParams({
    latitude: String(FAIRFIELD.latitude),
    longitude: String(FAIRFIELD.longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'dew_point_2m',
      'precipitation',
      'rain',
      'weather_code',
      'pressure_msl',
      'wind_speed_10m',
      'wind_gusts_10m',
      'wind_direction_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
    ].join(','),
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    timezone: FAIRFIELD.timezone,
    forecast_days: '5',
  })

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with status ${response.status}`)
  }

  return normalizeOpenMeteoResponse(await response.json())
}

module.exports = {
  fetchLiveWeather,
}
