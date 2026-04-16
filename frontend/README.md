# AgriPulse Intelligence - Frontend

A modern Next.js 14 (App Router) frontend for AgriPulse Intelligence, a B2B agri-input demand prediction platform serving the Vidarbha cotton belt in India.

## Features

- **Command Center Dashboard**: Real-time KPIs and alerts
- **Weather Intelligence**: District-specific meteorological data and trends
- **Satellite Data**: NASA POWER satellite data visualization (solar irradiance, ET, humidity, wind)
- **Mandi Prices**: Market commodity prices with sorting and filtering
- **Demand Forecast**: 14-day agri-input demand predictions
- **Pest Intelligence**: Real-time pest and disease alerts
- **Crop Yield Analytics**: District-wise yield estimation and optimization
- **District Map**: Leaflet-based NDVI visualization for crop health monitoring

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: React 18
- **Styling**: Tailwind CSS with custom brand colors
- **Charts**: Recharts (temperature, demand, yield visualizations)
- **Maps**: Leaflet + React-Leaflet
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query (v5)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Type Safety**: TypeScript

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── layout.tsx       # Root layout with Sidebar
│   │   ├── page.tsx         # Command Center (home)
│   │   ├── providers.tsx    # React Query provider
│   │   ├── weather/         # Weather Intelligence page
│   │   ├── satellite/       # Satellite Intelligence page
│   │   ├── market/          # Mandi Prices page
│   │   ├── forecast/        # Demand Forecast page
│   │   ├── alerts/          # Pest Intelligence page
│   │   ├── crop-yield/      # Crop Yield Analytics page
│   │   └── map/             # District Map page
│   ├── components/          # Reusable React components
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── WeatherChart.tsx
│   │   ├── SatellitePanel.tsx
│   │   ├── MandiTable.tsx
│   │   ├── NDVIMap.tsx
│   │   └── AlertBanner.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useWeather.ts
│   │   ├── useSatellite.ts
│   │   └── useDashboard.ts
│   ├── lib/                 # Utilities and API client
│   │   └── api.ts
│   └── styles/              # Global styles
│       └── globals.css
├── public/                  # Static assets
├── Dockerfile              # Container configuration
├── package.json            # Dependencies
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Clone the repository:

```bash
cd frontend
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

3. Edit `.env.local` if needed (default API URL is `http://localhost:8000/api`):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will hot-reload as you make changes.

### Production Build

```bash
npm run build
npm run start
```

## Design System

### Brand Colors

- **Primary Green**: `#1b5e20` (AgriPulse brand color)
- **Dark Green**: `#0a3d12` (Sidebar gradient)
- **Accent Amber**: `#ff8f00` (Highlights, badges)
- **Success Green**: `#059669` (Positive trends)
- **Danger Red**: `#dc2626` (Alerts, critical)
- **Warning Yellow**: `#f59e0b` (Warnings)
- **Background**: `#f3f5f7` (Light gray)

### Component Library

- **StatCard**: KPI display with optional trend
- **WeatherChart**: Recharts line chart for temperature data
- **SatellitePanel**: NASA POWER data visualization with metrics grid
- **MandiTable**: Sortable commodity prices table
- **NDVIMap**: Leaflet map with NDVI overlay
- **AlertBanner**: Severity-colored alert notifications

## API Integration

All API calls go through `/src/lib/api.ts` which provides:

- **Weather endpoints**: `/weather`, `/weather/summary`
- **Satellite endpoints**: `/satellite`, `/satellite/summary`
- **Market endpoints**: `/market/prices`, `/market/data`
- **Dashboard endpoints**: `/dashboard`
- **Alerts endpoints**: `/alerts`

React Query hooks handle caching and stale-time management automatically.

## Key Features Breakdown

### 1. Command Center (Home Page)
- 5 KPI cards: Total Alerts, Avg Temperature, Rainfall, Crop Health, Predicted Demand
- Temperature trend chart
- Mini mandi prices table
- Quick stats (market volatility, wind speed, humidity)

### 2. Weather Intelligence
- District selector (Yavatmal, Nagpur, Amravati, Wardha)
- Current weather metrics (temp, rainfall, humidity, wind)
- 7-day temperature trend visualization
- Detailed weather summary card

### 3. Satellite Intelligence
- NASA POWER data for selected district
- 4-metric display: Solar Irradiance, ET, Humidity, Wind Speed
- Multi-metric trend chart
- NASA POWER explanation and agriculture use cases

### 4. Mandi Prices
- District filter
- Sortable commodity prices table with real-time updates
- Market summary cards (avg price, volatility, volume)
- Top commodities list
- Market health indicators

### 5. Demand Forecast
- 14-day demand predictions for fertilizer, pesticide, seeds
- Bar chart visualization
- Confidence level and trend indicators
- Strategic recommendations based on forecast

### 6. Pest Intelligence
- Real-time pest pressure alerts
- Severity-based alert categorization (critical, warning, info)
- Common pests and diseases reference
- IPM prevention tips

### 7. Crop Yield Analytics
- Current yield vs target comparison by district
- Yield trend and forecast line chart
- District-wise yield gap analysis
- Yield enhancement strategies

### 8. District Map
- Leaflet-based map of Vidarbha
- NDVI-based circle markers for each district
- Color-coded health status (green/yellow/red)
- Interactive popups with NDVI values

## Responsive Design

- **Mobile-First Approach**: Sidebar collapses on screens <768px
- **Grid Layouts**: Adapt from 1 column (mobile) to 2-4 columns (desktop)
- **Touch-Friendly**: Large tap targets for mobile navigation
- **Performance**: Optimized images and lazy-loading

## Docker Deployment

Build and run with Docker:

```bash
docker build -t agripulse-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://api:8000/api agripulse-frontend
```

## Performance Optimizations

- **React Query**: Automatic request deduplication and caching
- **Next.js Image Optimization**: (when using next/image)
- **Code Splitting**: Automatic per-route splitting
- **Incremental Static Regeneration**: (can be enabled per page)

## Troubleshooting

### API Connection Issues

Ensure the backend is running on `http://localhost:8000`. Check `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Map Not Loading

Leaflet requires CSS imports. Ensure `leaflet/dist/leaflet.css` is imported in components using the map.

### Chart Data Not Displaying

Verify the backend returns properly formatted data. Check React Query DevTools in development.

## Future Enhancements

- WebSocket integration for real-time alerts
- Advanced analytics with custom date ranges
- User preferences and saved dashboards
- Mobile app (React Native)
- Offline-first PWA capabilities
- Multi-language support

## Contributing

Follow the existing code style and component patterns. Ensure TypeScript strict mode compliance.

## License

Proprietary - AgriPulse Intelligence
