import './App.css'

function App() {
  return (
    <div className="app-shell">
      {/* Navbar */}
      <header className="topbar">
        <div className="topbar__inner">
          <a className="brand" href="/" aria-label="Incoming home">
            Incoming
          </a>

          <button className="feedback-button" type="button">
            Send feedback
          </button>

          <label className="search" aria-label="Search location">
            <span className="search__icon">⌕</span>
            <input type="search" placeholder="Fairfield, Iowa" />
            <span className="search__location">➤</span>
          </label>

          <div className="topbar__actions" aria-label="Header actions">
            <button type="button" aria-label="Share">
              ⇧
            </button>
            <button type="button" aria-label="Menu">
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="section-tabs" aria-label="Weather sections">
        <a className="section-tabs__item section-tabs__item--active" href="#today">
          Today
        </a>
        <a className="section-tabs__item" href="#hourly">
          Hourly
        </a>
        <a className="section-tabs__item" href="#ten-day">
          10 Day
        </a>
        <a className="section-tabs__item" href="#week">
          Week
        </a>
        <a className="section-tabs__item" href="#radar">
          Radar
        </a>
        <a className="section-tabs__item" href="#more">
          More ▾
        </a>
      </nav>

      {/* Main Content Sections */}
      <main className="dashboard" id="today">
        <section className="summary-grid" aria-label="Weather summary">
          <article className="panel current-panel">
            <div className="panel__body current-panel__body">
              <div>
                <p className="location-label">Fairfield</p>
                <div className="temperature-placeholder">48°</div>
                <p className="muted">Feels like 45°</p>
                <p className="muted">Dewpoint 43°</p>
              </div>

              <div className="weather-symbol weather-symbol--sun">☀</div>

              <div className="wind-placeholder">
                <span>↗</span>
                <strong>9 mph</strong>
                <small>Gust 13 mph</small>
                <p>Clear</p>
              </div>
            </div>

            <div className="metric-row">
              <span>0 in<br />Rain</span>
              <span>81%<br />Rel. hum.</span>
              <span>29.6 inHg<br />Pressure</span>
            </div>

            <div className="sun-row">
              <span>6:02 AM<br />Sunrise</span>
              <span className="sun-arc">14 h 5 min</span>
              <span>8:07 PM<br />Sunset</span>
            </div>

            <footer className="panel-link">See Hourly Forecast ›</footer>
          </article>

          <article className="panel forecast-panel" id="ten-day">
            <header className="panel__heading">5 Day Forecast</header>
            <div className="forecast-strip">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                <div className="forecast-day" key={day}>
                  <strong>{day}</strong>
                  <span className="forecast-icon">☁</span>
                  <span>Max</span>
                  <b>--°</b>
                  <span>Min</span>
                  <b>--°</b>
                  <small>↘ -- mph</small>
                  <small>💧 0 in</small>
                </div>
              ))}
            </div>
            <footer className="panel-link">See 10 Day Forecast ›</footer>
          </article>

          <article className="panel radar-panel" id="radar">
            <header className="panel__heading">Weather Radar</header>
            <div className="radar-map">
              <span className="map-label map-label--north">Iowa City</span>
              <span className="map-label map-label--west">Ottumwa</span>
              <span className="map-pin">⌖</span>
            </div>
            <footer className="panel-link">See Radar ›</footer>
          </article>
        </section>

        <section className="warning-bar" aria-label="Weather warning">
          <span>⚠</span>
          <strong>1 active weather warning</strong>
          <span>›</span>
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
          <footer className="panel-link">See detailed forecast for the upcoming week ›</footer>
        </section>

        <section className="panel compact-panel" aria-label="Last visited">
          <header className="panel__heading">Last visited</header>
          <div className="visited-row">
            <span>Fairfield, Iowa</span>
            <strong>☾ 46°</strong>
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

        <section className="panel compact-panel" aria-label="Favorites">
          <header className="panel__heading">Your favorites</header>
          <div className="favorite-row">
            <span>Would you like to add Fairfield to your favorites for quick access?</span>
            <button type="button">Add</button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-columns">
          <section>
            <h2>Incoming</h2>
            <a href="#contact">Contact</a>
            <a href="#feedback">Send feedback</a>
            <a href="#sources">Data sources</a>
            <a href="#privacy">Privacy policy</a>
          </section>
          <section>
            <h2>Services</h2>
            <a href="#api">Weather API</a>
            <a href="#media">Products for media</a>
            <a href="#widget">Add weather widget</a>
            <a href="#calendar">Add weather to your calendar</a>
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
