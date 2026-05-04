const RADAR_METADATA_URL = 'https://api.librewxr.net/public/weather-maps.json'
const RADAR_ZOOM = 6
const TILE_SIZE = 512

function getTileCoordinates(latitude, longitude, zoom) {
  const latRadians = latitude * (Math.PI / 180)
  const scale = 2 ** zoom
  const x = Math.floor(((longitude + 180) / 360) * scale)
  const y = Math.floor(((1 - Math.log(Math.tan(latRadians) + 1 / Math.cos(latRadians)) / Math.PI) / 2) * scale)

  return { x, y, z: zoom }
}

function formatFrameTime(timestamp) {
  return new Date(timestamp * 1000).toISOString()
}

async function fetchWithTimeout(url, timeoutMs = 4000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchRadarMetadata(location) {
  try {
    const response = await fetchWithTimeout(RADAR_METADATA_URL)

    if (!response.ok) {
      throw new Error(`Radar metadata request failed with status ${response.status}`)
    }

    const payload = await response.json()
    const latestFrame = payload.radar?.past?.at(-1)

    if (!latestFrame) {
      throw new Error('Radar metadata did not include a past frame.')
    }

    const tile = getTileCoordinates(location.latitude, location.longitude, RADAR_ZOOM)

    return {
      status: 'available',
      provider: 'LibreWXR',
      attribution: 'Radar data by LibreWXR',
      frameTime: formatFrameTime(latestFrame.time),
      generatedAt: formatFrameTime(payload.generated),
      zoom: tile.z,
      tileX: tile.x,
      tileY: tile.y,
      baseMapTileUrl: `https://tile.openstreetmap.org/${tile.z}/${tile.x}/${tile.y}.png`,
      radarTileUrl: `${payload.host}${latestFrame.path}/${TILE_SIZE}/${tile.z}/${tile.x}/${tile.y}/7/1_1.png`,
    }
  } catch (error) {
    return {
      status: 'unavailable',
      provider: 'LibreWXR',
      attribution: 'Radar data by LibreWXR',
      message: error.message,
    }
  }
}

module.exports = {
  fetchRadarMetadata,
}
