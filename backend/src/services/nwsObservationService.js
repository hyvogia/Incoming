const NWS_HEADERS = {
  'User-Agent': 'IncomingWeatherApp/1.0 (local development)',
  Accept: 'application/geo+json',
}

function celsiusToFahrenheit(value) {
  return Math.round((value * 9) / 5 + 32)
}

function kilometersPerHourToMph(value) {
  return Math.round(value * 0.621371)
}

function metersPerSecondToMph(value) {
  return Math.round(value * 2.23694)
}

function pascalsToInHg(value) {
  return Number((value * 0.0002953).toFixed(1))
}

function metersToMiles(value) {
  return Math.round(value * 0.000621371)
}

function readValue(quantity, transform = (value) => value) {
  if (!quantity || typeof quantity.value !== 'number') {
    return undefined
  }

  return transform(quantity.value)
}

function readTemperature(quantity) {
  if (quantity?.unitCode === 'wmoUnit:degC') {
    return readValue(quantity, celsiusToFahrenheit)
  }

  return readValue(quantity, Math.round)
}

function readWindSpeed(quantity) {
  if (quantity?.unitCode === 'wmoUnit:km_h-1') {
    return readValue(quantity, kilometersPerHourToMph)
  }

  if (quantity?.unitCode === 'wmoUnit:m_s-1') {
    return readValue(quantity, metersPerSecondToMph)
  }

  return readValue(quantity, Math.round)
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: NWS_HEADERS })

  if (!response.ok) {
    throw new Error(`NWS request failed with status ${response.status}`)
  }

  return response.json()
}

function normalizeObservation(station, latest) {
  const properties = latest.properties

  return {
    stationName: station.properties.name,
    temperature: readTemperature(properties.temperature),
    condition: properties.textDescription || 'Observed',
    windSpeed: readWindSpeed(properties.windSpeed),
    humidity: readValue(properties.relativeHumidity, Math.round),
    pressure: readValue(properties.barometricPressure, pascalsToInHg),
    visibility: readValue(properties.visibility, metersToMiles),
    observedAt: properties.timestamp ? new Date(properties.timestamp) : undefined,
  }
}

async function fetchNearestObservations(latitude, longitude) {
  try {
    const point = await fetchJson(`https://api.weather.gov/points/${latitude},${longitude}`)
    const stationCollectionUrl = point.properties.observationStations
    const stations = await fetchJson(stationCollectionUrl)
    const observations = []

    for (const station of stations.features.slice(0, 8)) {
      if (observations.length >= 3) {
        break
      }

      try {
        const latest = await fetchJson(`${station.id}/observations/latest`)
        observations.push(normalizeObservation(station, latest))
      } catch (error) {
        // Some nearby stations do not always publish latest observations.
      }
    }

    return {
      locationName: point.properties.relativeLocation
        ? `${point.properties.relativeLocation.properties.city}, ${point.properties.relativeLocation.properties.state}`
        : undefined,
      observations,
    }
  } catch (error) {
    return {
      locationName: undefined,
      observations: [],
    }
  }
}

module.exports = {
  fetchNearestObservations,
}
