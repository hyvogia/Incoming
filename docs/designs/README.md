# Weather App Design Diagrams

## Table of Contents

- [Purpose](#purpose)
- [Diagram Inventory](#diagram-inventory)
- [Tool Mapping](#tool-mapping)
- [Design Notes](#design-notes)

## Purpose

This folder contains the SDLC design-step diagram sources for the Weather App. Each artifact is written for the diagram tool selected for that diagram type.

## Diagram Inventory

| Diagram | Tool | File |
| --- | --- | --- |
| C4 System Context and Container | Structurizr | `c4-system-context-container.structurizr.dsl` |
| Component Diagram | Lucidchart | `component-diagram-lucidchart.md` |
| Sequence Diagram | SequenceDiagram.org | `weather-request-sequence.sequence` |
| Wireframes | Figma | `figma-wireframes.md` |
| ER Diagram for MongoDB Schema | Moon Modeler | `mongodb-er-diagram-moon-modeler.md` |

## Tool Mapping

Structurizr is used for architecture-as-code C4 modeling of the system context and container views.

Lucidchart is used for the professional component diagram because it supports UML-style component blocks, interfaces, and dependency connectors.

SequenceDiagram.org is used for the weather request flow because its text syntax is fast to paste, render, and revise.

Figma is used for UI/UX wireframes. The included wireframe spec can be recreated in Figma or used as the basis for a live Figma file.

Moon Modeler is used for MongoDB/NoSQL data modeling. The included schema notes define collections, fields, references, and indexes for visual modeling.

## Design Notes

The diagrams describe a staged implementation: mock data first, then backend normalization, then MongoDB persistence and live weather API integration.

The design follows the planned folder structure with a React TypeScript Vite frontend, Express backend, MongoDB persistence layer, and SDLC documentation.
