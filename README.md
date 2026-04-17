# Wikimedia Real-Time Analytics Dashboard

A real-time React dashboard that renders visualizations for live Wikipedia edit events. It connects to the Wikimedia WebSocket Gateway to display live feeds, charts, and heatmaps.

## Prerequisites

- **Node.js 20+** with npm

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

*Note: Ensure the backend services (Producer, Streams Processor, and WebSocket Gateway) are running so the dashboard can connect to the WebSocket and REST endpoints.*

## Features

- **Live Edit Feed**: Real-time stream of incoming edits.
- **Edits Per Minute**: Line chart tracking the global edit velocity.
- **Top Wikis**: Bar chart displaying the most active wikis.
- **Bot vs Human Ratio**: Donut chart analyzing the origin of edits.
- **Geographic Heatmap**: Live map displaying edit locations.

## Technologies Used

- **React & TypeScript**
- **Vite**
- **Redux Toolkit**
- **Tailwind CSS**
- **Recharts**
- **Leaflet**
