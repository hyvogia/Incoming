# Figma Wireframes

## Table of Contents

- [Purpose](#purpose)
- [Figma File](#figma-file)
- [Frame List](#frame-list)
- [Desktop Dashboard Wireframe](#desktop-dashboard-wireframe)
- [Mobile Dashboard Wireframe](#mobile-dashboard-wireframe)
- [Component Notes](#component-notes)
- [Prototype Notes](#prototype-notes)

## Purpose

This document defines the Weather App wireframes to create in Figma. It is intended as the source brief for a Figma design file and should be used to build the initial low-fidelity UI before applying final visual design.

## Figma File

Recommended file name: `Weather App - SDLC Design Wireframes`.

Recommended page name: `Wireframes`.

Recommended frames:

| Frame | Size | Purpose |
| --- | --- | --- |
| `Desktop / Today Dashboard` | 1440 x 1200 | Primary desktop dashboard view. |
| `Mobile / Today Dashboard` | 390 x 1400 | Responsive stacked dashboard view. |
| `Desktop / Radar and Globe` | 1440 x 1000 | Expanded globe/map exploration view. |

## Frame List

Create shared low-fidelity components for:

| Component | Notes |
| --- | --- |
| `Top Navigation` | Logo, search field, location button, share icon, menu icon. |
| `Section Tabs` | Today, Hourly, 10 Day, Week, Radar, More. |
| `Current Weather Panel` | Location, large temperature, condition icon, wind, feels-like, dew point, humidity, pressure, sunrise, sunset. |
| `Forecast Card List` | Compact day columns with icon, high/low, wind, and precipitation. |
| `Radar Preview Panel` | Map preview, location marker, link to radar. |
| `Weather Warning Bar` | Full-width alert row below summary cards. |
| `Weekly Forecast Chart` | Time labels, weather icons, temperature curve, precipitation bars, wind arrows. |
| `Nearby Observation Card` | Station name, icon, temperature, wind, humidity, pressure, visibility, timestamp. |
| `Favorite Location Row` | Location name, compact condition, temperature, add/remove action. |
| `Globe3D View` | Large interactive globe area with layer controls and selected-location panel. |

## Desktop Dashboard Wireframe

Use a centered dashboard layout with a narrow content width similar to the reference screen.

Place the top navigation across the full viewport width.

Place section tabs directly below the top navigation.

In the main content area, create a three-column summary row:

| Column | Panel |
| --- | --- |
| Left | Current Weather Panel |
| Middle | Forecast Card List |
| Right | Radar Preview Panel |

Place the weather warning bar below the summary row.

Place the weekly forecast chart below the warning bar.

Place a last visited row below the chart.

Place nearby observation cards in a three-column row.

Place a favorites row below observations.

Place footer link groups below the dashboard content.

## Mobile Dashboard Wireframe

Use a single-column stacked layout.

Keep the search field visible near the top.

Turn section tabs into horizontally scrollable tabs.

Stack summary panels in this order:

- Current Weather Panel
- Forecast Card List
- Radar Preview Panel
- Weather Warning Bar
- Weekly Forecast Chart
- Last Visited Row
- Nearby Observation Cards
- Favorites Row

Keep chart labels and weather icons readable without horizontal overlap.

## Component Notes

Use low-fidelity grayscale blocks for the first wireframe pass.

Use simple weather icon placeholders such as sun, cloud, rain, and moon symbols.

Do not include Foreca branding or proprietary logo assets.

Use realistic content from the Fairfield, Iowa reference so spacing and density can be evaluated.

Represent the 3D globe as a large circular globe placeholder with latitude/longitude lines, map pins, and a compact layer-control panel.

## Prototype Notes

Link `Today` tab to `Desktop / Today Dashboard`.

Link `Radar` tab and radar preview action to `Desktop / Radar and Globe`.

Link the mobile `Radar` tab to a mobile version of the radar/globe view when that frame is added.

Use prototype interactions for search focus, favorite add/remove, and map layer toggles in later design iterations.
