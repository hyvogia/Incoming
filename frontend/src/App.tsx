import { useEffect, useState } from 'react'
import './App.css'

type AppView = 'dashboard' | 'development'

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
  provider: string
}

type ForecastDay = {
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
    { day: 'Mon', condition: 'Partly cloudy', high: 81, low: 46, windSpeed: 9, precipitation: 0.01 },
    { day: 'Tue', condition: 'Cloudy', high: 59, low: 46, windSpeed: 9, precipitation: 0 },
    { day: 'Wed', condition: 'Cloudy', high: 55, low: 39, windSpeed: 7, precipitation: 0 },
    { day: 'Thu', condition: 'Partly cloudy', high: 61, low: 37, windSpeed: 7, precipitation: 0.01 },
    { day: 'Fri', condition: 'Partly cloudy', high: 66, low: 46, windSpeed: 7, precipitation: 0 },
  ],
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

function App() {
  const [view, setView] = useState<AppView>('dashboard')
  const [weather, setWeather] = useState<WeatherSummary>(fallbackWeather)
  const [weatherSource, setWeatherSource] = useState('fallback')
  const [weatherStatus, setWeatherStatus] = useState<'loading' | 'ready' | 'error'>('loading')

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
  const locationName = `${weather.location.name}, ${weather.location.region}`
  const weatherIcon = getWeatherIcon(weather.current.condition)

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
                  <p className="location-label">{weather.location.name}</p>
                  <div className="temperature-placeholder">{weather.current.temperature}°</div>
                  <p className="muted">Feels like {weather.current.feelsLike}°</p>
                  <p className="muted">Dewpoint {weather.current.dewPoint}°</p>
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
                    <b>{day.high}°</b>
                    <span>Min</span>
                    <b>{day.low}°</b>
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
              <div className="radar-map">
                <span className="map-label map-label--north">Iowa City</span>
                <span className="map-label map-label--west">Ottumwa</span>
                <span className="map-label map-label--location">{locationName}</span>
                <span className="map-pin">⌖</span>
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
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'].map((day) => (
                  <div key={day}>
                    <strong>{day}</strong>
                    <small>☀ ☁ ☂</small>
                  </div>
                ))}
              </div>
              <div className="chart-grid">
                <div className="temperature-line" />
                <div className="precip-bar precip-bar--one" />
                <div className="precip-bar precip-bar--two" />
                <div className="precip-bar precip-bar--three" />
              </div>
              <div className="wind-row">
                {Array.from({ length: 24 }, (_, index) => (
                  <span key={index}>➜</span>
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
              <strong>{weatherIcon} {weather.current.temperature}°</strong>
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
