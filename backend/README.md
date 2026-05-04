# Incoming Backend

Express and MongoDB backend for the Incoming weather app.

## Setup

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Start MongoDB locally or set `MONGODB_URI` to a hosted MongoDB connection string.

Install dependencies:

```bash
npm install
```

Run in development:

```bash
npm run dev
```

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Backend health check. |
| `GET` | `/api/weather/summary` | Returns dashboard-ready weather summary data. |
| `POST` | `/api/weather/seed` | Seeds mock Fairfield weather data into MongoDB. |

Default local URL: `http://127.0.0.1:5050`.
