require('dotenv').config()

const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const connectDatabase = require('./config/database')
const locationRoutes = require('./routes/locationRoutes')
const weatherRoutes = require('./routes/weatherRoutes')

const app = express()
const port = process.env.PORT || 5050
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173'

app.use(cors({ origin: clientOrigin }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'incoming-weather-backend',
  })
})

app.use('/api/weather', weatherRoutes)
app.use('/api/locations', locationRoutes)

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  })
})

app.use((error, req, res, next) => {
  console.error(error)

  res.status(500).json({
    error: 'Internal server error',
  })
})

async function startServer() {
  try {
    await connectDatabase()

    app.listen(port, '127.0.0.1', () => {
      console.log(`Incoming backend running on http://127.0.0.1:${port}`)
    })
  } catch (error) {
    console.error('Failed to start backend')
    console.error(error.message)
    process.exit(1)
  }
}

startServer()
