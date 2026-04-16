'use client';

import { SatelliteData } from '@/lib/api';
import { Cloud, Wind, Droplets, Sun } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SatellitePanelProps {
  data: SatelliteData[];
  loading?: boolean;
}

export function SatellitePanel({ data, loading }: SatellitePanelProps) {
  if (loading) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <div className="text-gray-500">Loading satellite data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <div className="text-gray-500">No satellite data available</div>
      </div>
    );
  }

  const latestData = data[data.length - 1];

  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    irradiance: item.solar_irradiance,
    et: item.et,
    humidity: item.humidity,
  }));

  const metrics = [
    {
      label: 'Solar Irradiance',
      value: latestData.solar_irradiance.toFixed(2),
      unit: 'MJ/m²',
      icon: Sun,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'ET (Evapotranspiration)',
      value: latestData.et.toFixed(2),
      unit: 'mm',
      icon: Droplets,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Humidity',
      value: latestData.humidity.toFixed(1),
      unit: '%',
      icon: Cloud,
      color: 'bg-cyan-50 text-cyan-600',
    },
    {
      label: 'Wind Speed',
      value: latestData.wind_speed.toFixed(1),
      unit: 'm/s',
      icon: Wind,
      color: 'bg-teal-50 text-teal-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, unit, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {value}
                  <span className="text-sm text-gray-500 ml-1">{unit}</span>
                </p>
              </div>
              <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          NASA POWER Data Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
              cursor={{ stroke: '#ff8f00', strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="irradiance"
              stroke="#fbbf24"
              name="Solar Irradiance"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="et"
              stroke="#3b82f6"
              name="ET"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#06b6d4"
              name="Humidity"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
