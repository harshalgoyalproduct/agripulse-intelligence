'use client';

import { useDashboard, useAlerts, useMandiPrices } from '@/hooks/useDashboard';
import { useWeatherSummary } from '@/hooks/useWeather';
import { StatCard } from '@/components/StatCard';
import { AlertBanner } from '@/components/AlertBanner';
import { WeatherChart } from '@/components/WeatherChart';
import { MandiTable } from '@/components/MandiTable';
import {
  Cloud,
  TrendingUp,
  Leaf,
  AlertCircle,
  Droplet,
  Wind,
} from 'lucide-react';

export default function Home() {
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();
  const { data: alerts = [] } = useAlerts();
  const { data: mandiPrices = [], isLoading: mandiLoading } = useMandiPrices();
  const { data: weatherData = [], isLoading: weatherLoading } =
    useWeatherSummary();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Command Center</h1>
        <p className="text-gray-600 mt-2">
          Real-time intelligence for Vidarbha cotton belt agri-input demand
        </p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Alerts"
          value={dashboard?.total_alerts ?? '-'}
          icon={<AlertCircle size={24} />}
          color="danger"
          change={12}
          subtext="Active notifications"
        />
        <StatCard
          label="Avg Temperature"
          value={dashboard?.avg_temperature?.toFixed(1) ?? '-'}
          unit="°C"
          icon={<Cloud size={24} />}
          color="warning"
          change={-3}
          subtext="Current period"
        />
        <StatCard
          label="Rainfall"
          value={dashboard?.rainfall_mm?.toFixed(1) ?? '-'}
          unit="mm"
          icon={<Droplet size={24} />}
          color="primary"
          change={45}
          subtext="This month"
        />
        <StatCard
          label="Crop Health"
          value={dashboard?.crop_health_index?.toFixed(2) ?? '-'}
          unit="/10"
          icon={<Leaf size={24} />}
          color="success"
          change={8}
          subtext="NDVI average"
        />
        <StatCard
          label="Predicted Demand"
          value={dashboard?.predicted_demand?.toFixed(0) ?? '-'}
          unit="units"
          icon={<TrendingUp size={24} />}
          color="primary"
          change={22}
          subtext="Next 14 days"
        />
      </div>

      {/* Weather Chart */}
      <WeatherChart data={weatherData} loading={weatherLoading} />

      {/* Mandi Prices */}
      <MandiTable data={mandiPrices} loading={mandiLoading} compact />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">
            Market Volatility
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {dashboard?.market_volatility?.toFixed(1) ?? '-'}%
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Moderate fluctuation in mandi prices
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">
            Wind Speed Average
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {(
              weatherData.reduce((acc, w) => acc + (w.wind_speed || 0), 0) /
              (weatherData.length || 1)
            ).toFixed(1)}
            <span className="text-sm text-gray-500 ml-1">m/s</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">Across all districts</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">
            Avg Humidity
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {(
              weatherData.reduce((acc, w) => acc + (w.humidity || 0), 0) /
              (weatherData.length || 1)
            ).toFixed(0)}
            <span className="text-sm text-gray-500 ml-1">%</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">Moisture levels</p>
        </div>
      </div>
    </div>
  );
}
