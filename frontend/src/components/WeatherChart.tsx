'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { WeatherData } from '../lib/api';

interface WeatherChartProps {
  data: WeatherData[];
  loading?: boolean;
}

export function WeatherChart({ data, loading }: WeatherChartProps) {
  if (loading) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <div className="text-gray-500">Loading weather data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <div className="text-gray-500">No weather data available</div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    max: item.temp_max,
    min: item.temp_min,
    avg: item.temp_avg,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Temperature Trends
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
          <Legend />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#ff6b6b"
            name="Max Temp"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#4dabf7"
            name="Min Temp"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#ff8f00"
            name="Avg Temp"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
