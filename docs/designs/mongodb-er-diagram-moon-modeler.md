# MongoDB ER Diagram for Moon Modeler

## Table of Contents

- [Purpose](#purpose)
- [Moon Modeler Setup](#moon-modeler-setup)
- [Collections](#collections)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Modeling Notes](#modeling-notes)

## Purpose

This document defines the MongoDB schema to model visually in Moon Modeler. The design supports saved locations, cached weather data, alerts, forecasts, observations, and optional user favorites.

## Moon Modeler Setup

Create a new Moon Modeler project named `Weather App - MongoDB Schema`.

Select MongoDB as the target database.

Create collections from the tables below and add references where noted.

Use embedded documents for forecast arrays, hourly readings, and normalized provider payload fragments when they are always loaded with the parent weather document.

## Collections

### `locations`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | ObjectId | Yes | Primary identifier. |
| `name` | String | Yes | Display name, such as `Fairfield`. |
| `region` | String | No | State, province, or administrative area. |
| `country` | String | Yes | Country name or ISO code. |
| `latitude` | Number | Yes | Decimal latitude. |
| `longitude` | Number | Yes | Decimal longitude. |
| `timezone` | String | No | IANA timezone name. |
| `createdAt` | Date | Yes | Creation timestamp. |
| `updatedAt` | Date | Yes | Last update timestamp. |

### `weather_data`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | ObjectId | Yes | Primary identifier. |
| `locationId` | ObjectId | Yes | Reference to `locations._id`. |
| `provider` | String | Yes | Weather API provider name. |
| `providerLocationId` | String | No | Provider-specific location key. |
| `observedAt` | Date | Yes | Current condition observation time. |
| `expiresAt` | Date | Yes | Cache expiration time. |
| `current` | Object | Yes | Embedded current weather document. |
| `dailyForecast` | Array | Yes | Embedded daily forecast entries. |
| `hourlyForecast` | Array | No | Embedded hourly forecast entries. |
| `weeklyChart` | Object | No | Embedded chart-ready weather series. |
| `alerts` | Array | No | Embedded alert summaries or references. |
| `createdAt` | Date | Yes | Creation timestamp. |
| `updatedAt` | Date | Yes | Last update timestamp. |

### `observations`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | ObjectId | Yes | Primary identifier. |
| `locationId` | ObjectId | Yes | Reference to nearest `locations._id`. |
| `stationName` | String | Yes | Observation station display name. |
| `stationCode` | String | No | Provider or station identifier. |
| `latitude` | Number | No | Station latitude. |
| `longitude` | Number | No | Station longitude. |
| `temperature` | Number | Yes | Observed temperature. |
| `condition` | String | Yes | Current condition label. |
| `windSpeed` | Number | No | Wind speed. |
| `humidity` | Number | No | Relative humidity percentage. |
| `pressure` | Number | No | Atmospheric pressure. |
| `visibility` | Number | No | Visibility distance. |
| `observedAt` | Date | Yes | Observation timestamp. |

### `favorite_locations`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | ObjectId | Yes | Primary identifier. |
| `locationId` | ObjectId | Yes | Reference to `locations._id`. |
| `label` | String | No | Optional custom display label. |
| `sortOrder` | Number | No | User-defined display order. |
| `createdAt` | Date | Yes | Creation timestamp. |
| `updatedAt` | Date | Yes | Last update timestamp. |

### `api_cache`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | ObjectId | Yes | Primary identifier. |
| `cacheKey` | String | Yes | Unique normalized cache key. |
| `provider` | String | Yes | Weather API provider name. |
| `requestUrlHash` | String | No | Hash of request URL and parameters. |
| `payload` | Object | Yes | Raw or normalized API response payload. |
| `expiresAt` | Date | Yes | Cache expiration timestamp. |
| `createdAt` | Date | Yes | Creation timestamp. |

## Relationships

| From | To | Relationship |
| --- | --- | --- |
| `weather_data.locationId` | `locations._id` | Many weather cache records can belong to one location. |
| `observations.locationId` | `locations._id` | Many observations can be associated with one nearby location. |
| `favorite_locations.locationId` | `locations._id` | Many favorite rows can reference one location. |
| `api_cache.cacheKey` | Provider request | Cache records map application requests to provider responses. |

## Indexes

| Collection | Index | Purpose |
| --- | --- | --- |
| `locations` | `{ latitude: 1, longitude: 1 }` | Geospatial lookup support. |
| `locations` | `{ name: 1, region: 1, country: 1 }` | Location search and uniqueness checks. |
| `weather_data` | `{ locationId: 1, provider: 1, expiresAt: 1 }` | Fast cache lookup by location and provider. |
| `observations` | `{ locationId: 1, observedAt: -1 }` | Latest nearby observations. |
| `favorite_locations` | `{ locationId: 1 }` | Favorite lookup by location. |
| `api_cache` | `{ cacheKey: 1 }` unique | Prevents duplicate cache records. |
| `api_cache` | `{ expiresAt: 1 }` | Enables expiration cleanup. |

## Modeling Notes

Embed `current`, `dailyForecast`, `hourlyForecast`, and `weeklyChart` inside `weather_data` because the dashboard usually loads these fields together.

Keep `locations` as a separate collection because multiple weather cache records, observations, and favorites can reuse the same location.

Use `api_cache` for provider-level raw or normalized responses when the cache lifecycle is different from dashboard-ready weather data.

Add a user account collection later only if authentication or multi-user favorites become part of the product scope.
