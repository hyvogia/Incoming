import { useEffect, useState } from 'react'
import './App.css'

type AppView = 'dashboard' | 'development'
type TemperatureUnit = 'fahrenheit' | 'celsius'

type WeatherSummary = {
  location: {
    name: string
    region: string
    country: string
    latitude: number
    longitude: number
  }
  current: {
    temperature: number
    feelsLike: number
    dewPoint: number
    condition: string
    windSpeed: number
    windGust: number
    humidity: number
    pressure: number
    rain: number
    sunrise: string
    sunset: string
  }
  forecast: ForecastDay[]
  radar?: {
    status: 'available' | 'unavailable'
    provider?: string
    attribution?: string
    frameTime?: string
    generatedAt?: string
    baseMapTileUrl?: string
    radarTileUrl?: string
    message?: string
  }
  provider: string
}

type ForecastDay = {
  date?: string
  day: string
  condition: string
  high: number
  low: number
  windSpeed: number
  precipitation: number
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5050'

const fallbackWeather: WeatherSummary = {
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
    { date: '2026-05-04', day: 'Mon', condition: 'Partly cloudy', high: 81, low: 46, windSpeed: 9, precipitation: 0.01 },
    { date: '2026-05-05', day: 'Tue', condition: 'Cloudy', high: 59, low: 46, windSpeed: 9, precipitation: 0 },
    { date: '2026-05-06', day: 'Wed', condition: 'Cloudy', high: 55, low: 39, windSpeed: 7, precipitation: 0 },
    { date: '2026-05-07', day: 'Thu', condition: 'Partly cloudy', high: 61, low: 37, windSpeed: 7, precipitation: 0.01 },
    { date: '2026-05-08', day: 'Fri', condition: 'Partly cloudy', high: 66, low: 46, windSpeed: 7, precipitation: 0 },
    { date: '2026-05-09', day: 'Sat', condition: 'Clear', high: 68, low: 47, windSpeed: 8, precipitation: 0 },
    { date: '2026-05-10', day: 'Sun', condition: 'Rain', high: 72, low: 50, windSpeed: 11, precipitation: 0.18 },
    { date: '2026-05-11', day: 'Mon', condition: 'Partly cloudy', high: 64, low: 45, windSpeed: 10, precipitation: 0.03 },
    { date: '2026-05-12', day: 'Tue', condition: 'Clear', high: 66, low: 46, windSpeed: 9, precipitation: 0 },
  ],
  radar: {
    status: 'unavailable',
    provider: 'LibreWXR',
    attribution: 'Radar data by LibreWXR',
  },
  provider: 'fallback',
}

function getWeatherIcon(condition: string) {
  const normalized = condition.toLowerCase()

  if (normalized.includes('rain') || normalized.includes('drizzle') || normalized.includes('shower')) {
    return '🌧'
  }

  if (normalized.includes('thunder')) {
    return '⛈'
  }

  if (normalized.includes('snow')) {
    return '❄'
  }

  if (normalized.includes('cloud') || normalized.includes('overcast')) {
    return '☁'
  }

  return '☀'
}

function convertTemperature(value: number, unit: TemperatureUnit) {
  if (unit === 'fahrenheit') {
    return value
  }

  return Math.round((value - 32) * (5 / 9))
}

function formatTemperature(value: number, unit: TemperatureUnit) {
  return `${convertTemperature(value, unit)}°`
}

function formatRadarTime(value?: string) {
  if (!value) {
    return 'Live frame pending'
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatMonthDay(value?: string) {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}

function getTemperaturePolyline(days: ForecastDay[], unit: TemperatureUnit) {
  if (days.length === 0) {
    return ''
  }

  const temperatures = days.map((day) => convertTemperature(day.high, unit))
  const min = Math.min(...temperatures)
  const max = Math.max(...temperatures)
  const range = Math.max(max - min, 1)

  return temperatures
    .map((temperature, index) => {
      const x = days.length === 1 ? 50 : (index / (days.length - 1)) * 100
      const y = 86 - ((temperature - min) / range) * 62

      return `${x},${y}`
    })
    .join(' ')
}

function getPrecipitationHeight(day: ForecastDay, days: ForecastDay[]) {
  const max = Math.max(...days.map((forecastDay) => forecastDay.precipitation), 0.01)

  return Math.max((day.precipitation / max) * 82, day.precipitation > 0 ? 8 : 2)
}

function App() {
  const [view, setView] = useState<AppView>('dashboard')
  const [weather, setWeather] = useState<WeatherSummary>(fallbackWeather)
  const [weatherSource, setWeatherSource] = useState('fallback')
  const [weatherStatus, setWeatherStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('fahrenheit')

  const showDashboard = () => setView('dashboard')
  const showDevelopment = () => setView('development')

  useEffect(() => {
    let isMounted = true

    async function loadWeatherSummary() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/weather/summary`)

        if (!response.ok) {
          throw new Error('Weather request failed')
        }

        const payload = await response.json()

        if (isMounted) {
          setWeather(payload.data)
          setWeatherSource(payload.meta.source)
          setWeatherStatus('ready')
        }
      } catch (error) {
        if (isMounted) {
          setWeatherStatus('error')
        }
      }
    }

    loadWeatherSummary()

    return () => {
      isMounted = false
    }
  }, [])

  const forecastDays = weather.forecast.slice(0, 5)
  const weekDays = weather.forecast.slice(0, 9)
  const locationName = `${weather.location.name}, ${weather.location.region}`
  const weatherIcon = getWeatherIcon(weather.current.condition)
  const unitLabel = temperatureUnit === 'fahrenheit' ? 'F' : 'C'
  const hasLiveRadar = weather.radar?.status === 'available' && weather.radar.radarTileUrl
  const weeklyTemperatureLine = getTemperaturePolyline(weekDays, temperatureUnit)

  return (
    <div className="app-shell">
      {/* Navbar */}
      <header className="topbar">
        <div className="topbar__inner">
          <a className="brand" href="#today" aria-label="Incoming home" onClick={showDashboard}>
            Incoming
          </a>

          <button className="feedback-button is-muted-control" type="button" onClick={showDevelopment}>
            Send feedback
          </button>

          <label className="search" aria-label="Search location">
            <span className="search__icon">⌕</span>
            <input type="search" placeholder="Fairfield, Iowa" />
            <span className="search__location">➤</span>
          </label>

          <div className="topbar__actions is-muted-control" aria-label="Header actions">
            <button type="button" aria-label="Share" onClick={showDevelopment}>
              ⇧
            </button>
            <button type="button" aria-label="Menu" onClick={showDevelopment}>
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="section-tabs" aria-label="Weather sections">
        <a
          className={`section-tabs__item ${view === 'dashboard' ? 'section-tabs__item--active' : ''}`}
          href="#today"
          onClick={showDashboard}
        >
          Today
        </a>
        <a className="section-tabs__item section-tabs__item--muted" href="#development" onClick={showDevelopment}>
          Hourly
        </a>
        <a className="section-tabs__item section-tabs__item--muted" href="#development" onClick={showDevelopment}>
          10 Day
        </a>
        <a className="section-tabs__item section-tabs__item--muted" href="#development" onClick={showDevelopment}>
          Week
        </a>
        <a className="section-tabs__item section-tabs__item--muted" href="#development" onClick={showDevelopment}>
          Radar
        </a>
        <a className="section-tabs__item section-tabs__item--muted" href="#development" onClick={showDevelopment}>
          More ▾
        </a>
      </nav>

      {view === 'dashboard' ? (
        /* Main Content Sections */
        <main className="dashboard" id="today">
          <div className={`data-status data-status--${weatherStatus}`}>
            {weatherStatus === 'loading' && 'Loading live weather...'}
            {weatherStatus === 'ready' && `Live weather connected via ${weatherSource}`}
            {weatherStatus === 'error' && 'Live weather unavailable. Showing fallback data.'}
          </div>

          <section className="summary-grid" aria-label="Weather summary">
            <article className="panel current-panel">
              <div className="panel__body current-panel__body">
                <div>
                  <div className="location-heading">
                    <p className="location-label">{weather.location.name}</p>
                    <div className="unit-toggle" aria-label="Temperature unit">
                      <button
                        className={temperatureUnit === 'fahrenheit' ? 'unit-toggle__button--active' : ''}
                        type="button"
                        onClick={() => setTemperatureUnit('fahrenheit')}
                      >
                        °F
                      </button>
                      <button
                        className={temperatureUnit === 'celsius' ? 'unit-toggle__button--active' : ''}
                        type="button"
                        onClick={() => setTemperatureUnit('celsius')}
                      >
                        °C
                      </button>
                    </div>
                  </div>
                  <div className="temperature-placeholder">{formatTemperature(weather.current.temperature, temperatureUnit)}</div>
                  <p className="muted">Feels like {formatTemperature(weather.current.feelsLike, temperatureUnit)}</p>
                  <p className="muted">Dewpoint {formatTemperature(weather.current.dewPoint, temperatureUnit)}</p>
                </div>

                <div className="weather-symbol weather-symbol--sun">{weatherIcon}</div>

                <div className="wind-placeholder">
                  <span>↗</span>
                  <strong>{weather.current.windSpeed} mph</strong>
                  <small>Gust {weather.current.windGust} mph</small>
                  <p>{weather.current.condition}</p>
                </div>
              </div>

              <div className="metric-row">
                <span>{weather.current.rain} in<br />Rain</span>
                <span>{weather.current.humidity}%<br />Rel. hum.</span>
                <span>{weather.current.pressure} inHg<br />Pressure</span>
              </div>

              <div className="sun-row">
                <span>{weather.current.sunrise}<br />Sunrise</span>
                <span className="sun-arc">14 h 5 min</span>
                <span>{weather.current.sunset}<br />Sunset</span>
              </div>

              <footer className="panel-link">
                <button type="button" onClick={showDevelopment}>
                  See Hourly Forecast ›
                </button>
              </footer>
            </article>

            <article className="panel forecast-panel" id="ten-day">
              <header className="panel__heading">5 Day Forecast</header>
              <div className="forecast-strip">
                {forecastDays.map((day) => (
                  <div className="forecast-day" key={day.day}>
                    <strong>{day.day}</strong>
                    <span className="forecast-icon">{getWeatherIcon(day.condition)}</span>
                    <span>Max</span>
                    <b>{formatTemperature(day.high, temperatureUnit)}</b>
                    <span>Min</span>
                    <b>{formatTemperature(day.low, temperatureUnit)}</b>
                    <small>↘ {day.windSpeed} mph</small>
                    <small>💧 {day.precipitation} in</small>
                  </div>
                ))}
              </div>
              <footer className="panel-link">
                <button type="button" onClick={showDevelopment}>
                  See 10 Day Forecast ›
                </button>
              </footer>
            </article>

            <article className="panel radar-panel" id="radar">
              <header className="panel__heading">Weather Radar</header>
              <div className={`radar-map ${hasLiveRadar ? 'radar-map--live' : ''}`}>
                {hasLiveRadar && (
                  <>
                    <img className="radar-map__base" src={weather.radar?.baseMapTileUrl} alt="" />
                    <img className="radar-map__overlay" src={weather.radar?.radarTileUrl} alt={`Live weather radar near ${locationName}`} />
                  </>
                )}
                <span className="map-label map-label--north">Iowa City</span>
                <span className="map-label map-label--west">Ottumwa</span>
                <span className="map-label map-label--location">{locationName}</span>
                <span className="map-pin">⌖</span>
                <div className="radar-live-meta">
                  <strong>{hasLiveRadar ? 'Live radar' : 'Radar loading'}</strong>
                  <span>{formatRadarTime(weather.radar?.frameTime)}</span>
                  <small>{weather.radar?.attribution || 'Radar data pending'}</small>
                </div>
              </div>
              <footer className="panel-link">
                <button type="button" onClick={showDevelopment}>
                  See Radar ›
                </button>
              </footer>
            </article>
          </section>

          <section className="panel weekly-panel" id="week" aria-label="Weather for the week">
            <header className="panel__heading">Weather for the week</header>
            <div className="weekly-chart">
              <div className="chart-days">
                {weekDays.map((day) => (
                  <div key={day.date || `${day.day}-${day.high}-${day.low}`}>
                    <strong>{day.day}</strong>
                    <span>{formatMonthDay(day.date)}</span>
                    <small title={day.condition}>{getWeatherIcon(day.condition)} {formatTemperature(day.high, temperatureUnit)}</small>
                  </div>
                ))}
              </div>
              <div className="chart-grid">
                <svg className="temperature-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <polyline points={weeklyTemperatureLine} />
                </svg>
                <div className="weekly-bars" aria-label="Daily precipitation">
                  {weekDays.map((day) => (
                    <span
                      key={day.date || `${day.day}-rain`}
                      className="weekly-precip-bar"
                      style={{ height: `${getPrecipitationHeight(day, weekDays)}%` }}
                      title={`${day.precipitation} in precipitation`}
                    />
                  ))}
                </div>
              </div>
              <div className="wind-row">
                {weekDays.map((day) => (
                  <span key={day.date || `${day.day}-wind`}>➜ {day.windSpeed}</span>
                ))}
              </div>
            </div>
            <footer className="panel-link">
              <button type="button" onClick={showDevelopment}>
                See detailed forecast for the upcoming week ›
              </button>
            </footer>
          </section>

          <section className="panel compact-panel" aria-label="Last visited">
            <header className="panel__heading">Last visited</header>
            <div className="visited-row">
              <span>{locationName}</span>
              <strong>{weatherIcon} {formatTemperature(weather.current.temperature, temperatureUnit)}{unitLabel}</strong>
            </div>
          </section>

          <section className="panel observations-panel" aria-label="Nearest observations">
            <header className="panel__heading">Nearest Observations</header>
            <div className="observations-grid">
              {['Mount Pleasant Municipal Airport', 'Washington', 'Ottumwa Industrial Airport'].map((station) => (
                <article className="observation-card" key={station}>
                  <h3>{station}</h3>
                  <div className="observation-card__main">
                    <span className="weather-symbol weather-symbol--small">☀</span>
                    <strong>--°</strong>
                  </div>
                  <p>Clear</p>
                  <div className="observation-card__meta">
                    <span>↗ -- mph</span>
                    <span>Feels like --°</span>
                    <span>Rel. hum. --%</span>
                    <span>Visibility -- mi</span>
                  </div>
                </article>
              ))}
            </div>
            <p className="section-note">Nearest observations show current weather observations from your nearest weather stations.</p>
          </section>
        </main>
      ) : (
        /* In Development Page */
        <main className="development-page" id="development">
          <section className="development-card" aria-labelledby="development-title">
            <p className="development-kicker">Incoming</p>
            <h1 id="development-title">In development</h1>
            <p>
              This area is part of the planned Weather App experience and will be connected as each section is implemented.
            </p>
            <button type="button" onClick={showDashboard}>
              Back to Today
            </button>
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-columns">
          <section>
            <h2>Incoming</h2>
            <a href="#development" onClick={showDevelopment}>Contact</a>
            <a href="#development" onClick={showDevelopment}>Send feedback</a>
            <a href="#development" onClick={showDevelopment}>Data sources</a>
            <a href="#development" onClick={showDevelopment}>Privacy policy</a>
          </section>
          <section>
            <h2>Services</h2>
            <a href="#development" onClick={showDevelopment}>Weather API</a>
            <a href="#development" onClick={showDevelopment}>Products for media</a>
            <a href="#development" onClick={showDevelopment}>Add weather widget</a>
            <a href="#development" onClick={showDevelopment}>Add weather to your calendar</a>
          </section>
          <section>
            <h2>Weather App</h2>
            <div className="store-badge">App Store</div>
            <div className="store-badge">Google Play</div>
            <div className="store-badge">AppGallery</div>
          </section>
        </div>
      </footer>
    </div>
  )
}

export default App
