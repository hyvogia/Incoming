workspace "Weather App" "C4 system context and container design for the Weather App." {

    model {
        user = person "Weather App User" "Checks current weather, forecasts, warnings, observations, and map views."

        weatherApi = softwareSystem "External Weather API" "Provides current conditions, forecasts, alerts, and observation data." {
            tags "External"
        }

        mapTiles = softwareSystem "Map and Radar Tile Provider" "Provides map, terrain, globe, and optional radar tile data." {
            tags "External"
        }

        weatherApp = softwareSystem "Weather App" "Full-stack weather dashboard inspired by the Foreca reference experience." {
            frontend = container "Frontend Web App" "React + TypeScript + Vite weather dashboard with reusable UI components." "React, TypeScript, Vite" {
                tags "Frontend"
            }

            backend = container "Weather API Backend" "Express API that normalizes weather data, protects API keys, and serves frontend-ready responses." "Node.js, Express" {
                tags "Backend"
            }

            database = container "Weather Database" "Stores saved locations, cached weather responses, and optional historical weather records." "MongoDB" {
                tags "Database"
            }

            docs = container "SDLC Documentation" "Planning, requirements, design, implementation, testing, deployment, and maintenance documentation." "Markdown" {
                tags "Documentation"
            }
        }

        user -> frontend "Searches locations, views forecasts, opens map and globe views" "HTTPS"
        frontend -> backend "Requests normalized weather data" "JSON/HTTPS"
        frontend -> mapTiles "Loads map, globe, and optional radar tiles" "HTTPS"
        backend -> weatherApi "Fetches current, forecast, alert, and observation data" "HTTPS"
        backend -> database "Reads and writes favorites, cached responses, and saved locations" "MongoDB protocol"
        backend -> mapTiles "Optionally requests radar metadata or tile URLs" "HTTPS"
    }

    views {
        systemContext weatherApp "SystemContext" {
            include *
            autoLayout lr
            title "Weather App - C4 System Context"
            description "Shows users and external systems that interact with the Weather App."
        }

        container weatherApp "Containers" {
            include *
            autoLayout lr
            title "Weather App - C4 Container Diagram"
            description "Shows the main deployable/runtime containers and their responsibilities."
        }

        styles {
            element "Person" {
                shape person
                background #3366a3
                color #ffffff
            }
            element "Frontend" {
                background #2f80ed
                color #ffffff
            }
            element "Backend" {
                background #27ae60
                color #ffffff
            }
            element "Database" {
                shape cylinder
                background #7b61ff
                color #ffffff
            }
            element "Documentation" {
                background #8a8f98
                color #ffffff
            }
            element "External" {
                background #e07a5f
                color #ffffff
            }
        }
    }
}
