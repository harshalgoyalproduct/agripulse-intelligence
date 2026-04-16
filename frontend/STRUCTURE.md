# AgriPulse Frontend - File Structure

## Complete File Inventory

### Configuration Files
- **package.json** - Dependencies (Next.js 14, React 18, Recharts, Leaflet, TanStack React Query, Tailwind CSS, etc.)
- **next.config.js** - Next.js configuration with API rewrites to backend
- **tailwind.config.js** - Tailwind CSS with AgriPulse brand colors
- **postcss.config.js** - PostCSS configuration
- **tsconfig.json** - TypeScript strict mode configuration
- **.eslintrc.json** - ESLint rules (Next.js defaults)
- **.gitignore** - Git ignore patterns
- **Dockerfile** - Node 20 Alpine multi-stage build

### Environment
- **.env.example** - Base environment variables
- **.env.local.example** - Development environment template

### Root Styles
- **src/styles/globals.css** - Tailwind imports + custom CSS variables + utility classes

### API & Utilities
- **src/lib/api.ts** - API client with typed endpoints (weather, satellite, market, dashboard, alerts)

### Custom Hooks
- **src/hooks/useWeather.ts** - React Query hook for weather data
- **src/hooks/useSatellite.ts** - React Query hook for satellite data
- **src/hooks/useDashboard.ts** - React Query hooks for dashboard, alerts, mandi prices

### Components (7 Reusable Components)
- **src/components/Sidebar.tsx** - Navigation sidebar with mobile toggle, 8 menu items
- **src/components/StatCard.tsx** - KPI card with label, value, change%, icon, color variants
- **src/components/WeatherChart.tsx** - Recharts line chart (max/min/avg temperature)
- **src/components/SatellitePanel.tsx** - NASA POWER metrics grid + multi-metric trend chart
- **src/components/MandiTable.tsx** - Sortable commodity prices table with color-coded changes
- **src/components/NDVIMap.tsx** - Leaflet map with 4 Vidarbha districts, NDVI legend
- **src/components/AlertBanner.tsx** - Severity-based alert notifications with dismiss

### App Router Pages (8 Pages)
- **src/app/layout.tsx** - Root layout with Sidebar + main content area
- **src/app/providers.tsx** - React Query provider setup
- **src/app/page.tsx** - Command Center dashboard (5 KPIs, weather chart, mandi table, quick stats)
- **src/app/weather/page.tsx** - Weather Intelligence (district selector, metrics, trend chart)
- **src/app/satellite/page.tsx** - Satellite Intelligence (NASA POWER data, trend charts, info)
- **src/app/market/page.tsx** - Mandi Prices (district filter, sortable table, market insights)
- **src/app/forecast/page.tsx** - Demand Forecast (14-day predictions, bar chart, recommendations)
- **src/app/alerts/page.tsx** - Pest Intelligence (alert summary, pest/disease reference, IPM tips)
- **src/app/crop-yield/page.tsx** - Crop Yield Analytics (district yields, trend forecast, strategies)
- **src/app/map/page.tsx** - District Map (Leaflet NDVI visualization, interpretation guide)

### Documentation
- **README.md** - Complete setup, features, architecture, troubleshooting guide

## Key Statistics

- **Total Files**: 30+
- **Components**: 7 reusable React components
- **Pages**: 8 full-featured pages
- **Custom Hooks**: 3 React Query hooks
- **Tailwind Classes**: 1000+ via Tailwind CSS
- **TypeScript Coverage**: 100%
- **Responsive Design**: Mobile-first, sidebar collapses <768px

## Technology Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| UI Library | React 18 |
| Styling | Tailwind CSS 3.3 |
| Charts | Recharts 2.10 |
| Maps | Leaflet 1.9 + React-Leaflet 4.2 |
| State | Zustand 4.4 |
| Data Fetching | TanStack React Query 5.28 |
| Icons | Lucide React 0.294 |
| Dates | date-fns 2.30 |
| Type Safety | TypeScript 5.3 |
| Container | Docker (Node 20 Alpine) |

## Component Hierarchy

```
<RootLayout>
  <Sidebar>
    [Navigation Menu]
  </Sidebar>
  
  <main>
    <CommandCenter>
      <StatCard x5 />
      <AlertBanner />
      <WeatherChart />
      <MandiTable />
    </CommandCenter>
    
    <WeatherPage>
      <StatCard x6 />
      <WeatherChart />
    </WeatherPage>
    
    <SatellitePage>
      <SatellitePanel>
        <[Metrics Grid]>
        <[Trend Chart]>
      </SatellitePanel>
    </SatellitePage>
    
    <MarketPage>
      <StatCard x3 />
      <MandiTable />
      [Market Insights]
    </MarketPage>
    
    <ForecastPage>
      <StatCard x4 />
      <[BarChart]>
      [Strategic Recommendations]
    </ForecastPage>
    
    <AlertsPage>
      <AlertBanner />
      [Pest Reference Guide]
    </AlertsPage>
    
    <CropYieldPage>
      <StatCard x4 />
      <[BarChart]> (Yield Comparison)
      <[LineChart]> (Trend & Forecast)
    </CropYieldPage>
    
    <MapPage>
      <NDVIMap />
    </MapPage>
  </main>
</RootLayout>
```

## Design System

### Color Palette
- Primary: #1b5e20 (AgriPulse green)
- Dark: #0a3d12 (Sidebar)
- Accent: #ff8f00 (Amber highlights)
- Success: #059669 (Green trends)
- Danger: #dc2626 (Red alerts)
- Warning: #f59e0b (Yellow caution)
- Background: #f3f5f7 (Light gray)

### Typography
- Font Family: Inter (via next/font)
- Font Weights: 400, 500, 600, 700
- Scale: sm (12px) → xl (20px+)

### Spacing
- Base: 4px increments (Tailwind default)
- Card padding: 24px (6 units)
- Section gaps: 32px (8 units)

### Shadows
- Card: 0 1px 3px rgba(0,0,0,0.1)
- Card Hover: 0 4px 12px rgba(0,0,0,0.15)

## API Integration

All API calls are made through `src/lib/api.ts` which provides:

```typescript
// Weather
apiClient.getWeather(district) // Single district weather
apiClient.getWeatherSummary() // Summary across all

// Satellite
apiClient.getSatelliteData(district) // NASA POWER by district
apiClient.getSatelliteSummary() // Summary across all

// Market
apiClient.getMandiPrices(district?) // Commodity prices
apiClient.getMarketData() // Full market data

// Dashboard
apiClient.getDashboard() // KPI summary

// Alerts
apiClient.getAlerts() // All alerts
apiClient.getAlertsByType(type) // Filtered alerts
```

## Running Locally

```bash
# Install
npm install

# Development
npm run dev          # http://localhost:3000

# Production
npm run build
npm start            # http://localhost:3000

# Docker
docker build -t agripulse-frontend .
docker run -p 3000:3000 agripulse-frontend
```

## Key Features

✅ Real-time dashboard with live KPIs
✅ District-specific weather data
✅ NASA POWER satellite integration
✅ Sortable mandi prices with market trends
✅ 14-day demand forecasting
✅ Pest intelligence with severity alerts
✅ Crop yield optimization analytics
✅ Interactive NDVI map with health indicators
✅ Mobile-responsive design
✅ React Query caching for performance
✅ Full TypeScript type safety
✅ Docker-ready for production
