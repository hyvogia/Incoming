# Component Diagram for Lucidchart

## Table of Contents

- [Purpose](#purpose)
- [Lucidchart Setup](#lucidchart-setup)
- [Components](#components)
- [Connectors](#connectors)
- [Layout Guidance](#layout-guidance)

## Purpose

This document defines the Weather App component diagram to create in Lucidchart using UML component shapes, grouped containers, interfaces, and dependency connectors.

## Lucidchart Setup

Create a new Lucidchart document named `Weather App - Component Diagram`.

Enable the UML component shape library.

Use three grouped areas named `Frontend`, `Backend`, and `Data and External Services`.

Use dependency arrows for calls, solid connectors for internal composition, and dashed connectors for optional or future integrations.

## Components

| Area | Component | Responsibility |
| --- | --- | --- |
| Frontend | `App.tsx` | Root application shell and route composition. |
| Frontend | `Home.tsx` | Main weather dashboard page. |
| Frontend | `WeatherDisplay.tsx` | Current weather panel with temperature, condition, wind, pressure, humidity, and sunrise/sunset. |
| Frontend | `ForecastList.tsx` | Five-day and ten-day forecast card list. |
| Frontend | `WeeklyForecastChart.tsx` | Time-based weekly forecast visualization for temperature, precipitation, and wind. |
| Frontend | `Globe3D.tsx` | WebGL globe or map view for geographic weather exploration. |
| Frontend | `WeatherApiClient.ts` | Frontend API client for backend weather endpoints. |
| Backend | `server.js` | Express server bootstrap, middleware, and route mounting. |
| Backend | `weatherRoutes.js` | Weather API route definitions. |
| Backend | `weatherController.js` | Request handling and response formatting. |
| Backend | `weatherService.js` | Weather provider calls, mock data switching, and normalization. |
| Backend | `cacheService.js` | Optional caching logic for API responses. |
| Backend | `WeatherData.js` | MongoDB weather data model. |
| Backend | `Location.js` | MongoDB saved location or favorite model. |
| Data and External Services | `MongoDB` | Stores cached weather data, saved locations, and optional observation history. |
| Data and External Services | `External Weather API` | Provides current, forecast, alert, and observation data. |
| Data and External Services | `Map/Radar Tile Provider` | Provides map, globe, and radar tile data. |

## Connectors

| From | To | Connector Label |
| --- | --- | --- |
| `App.tsx` | `Home.tsx` | renders |
| `Home.tsx` | `WeatherDisplay.tsx` | composes current weather panel |
| `Home.tsx` | `ForecastList.tsx` | composes forecast panels |
| `Home.tsx` | `WeeklyForecastChart.tsx` | composes weekly trend chart |
| `Home.tsx` | `Globe3D.tsx` | composes map and globe view |
| `Home.tsx` | `WeatherApiClient.ts` | requests dashboard data |
| `WeatherApiClient.ts` | `weatherRoutes.js` | HTTP JSON calls |
| `server.js` | `weatherRoutes.js` | mounts routes |
| `weatherRoutes.js` | `weatherController.js` | delegates requests |
| `weatherController.js` | `weatherService.js` | fetches normalized weather data |
| `weatherService.js` | `External Weather API` | calls provider |
| `weatherService.js` | `cacheService.js` | reads/writes cache |
| `cacheService.js` | `WeatherData.js` | persists cached responses |
| `weatherController.js` | `Location.js` | manages favorites and saved locations |
| `WeatherData.js` | `MongoDB` | stores weather documents |
| `Location.js` | `MongoDB` | stores location documents |
| `Globe3D.tsx` | `Map/Radar Tile Provider` | loads map/radar assets |

## Layout Guidance

Place frontend components on the left, backend components in the center, and data/external services on the right.

Place `Home.tsx` in the visual center of the frontend area because it composes the primary user experience.

Place `weatherController.js` and `weatherService.js` in the center of the backend area because they are the main behavior boundary.

Use a dashed connector from `Globe3D.tsx` to `Map/Radar Tile Provider` to show that radar layers may be phased in after the core dashboard.
