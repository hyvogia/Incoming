function normalizeLocation(result) {
  return {
    id: result.id,
    name: result.name,
    region: result.admin1 || '',
    country: result.country || '',
    countryCode: result.country_code || '',
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone || 'auto',
    label: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
  }
}

async function searchLocations(query) {
  const trimmedQuery = query.trim()

  if (trimmedQuery.length < 2) {
    return []
  }

  const params = new URLSearchParams({
    name: trimmedQuery,
    count: '8',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`)

  if (!response.ok) {
    throw new Error(`Location search failed with status ${response.status}`)
  }

  const payload = await response.json()

  return (payload.results || []).map(normalizeLocation)
}

module.exports = {
  searchLocations,
}
