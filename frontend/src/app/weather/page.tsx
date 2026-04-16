'use client';

import { useState } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { WeatherChart } from '@/components/WeatherChart';
import { StatCard } from '@/components/StatCard';
import { Cloud, Droplet, Wind, Eye } from 'lucide-react';

const DISTRICTS = ['Yavatmal', 'Nagpur', 'Amravati', 'Wardha'];

export default function WeatherPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('Nagpur');
  const { data: weatherData = [], isLoading } = useWeather(selectedDistrict);

  const latest = weatherData[weatherData.length - 1];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Weather Intelligence</h1>
        <p className="text-gray-600 mt-2">
          Detailed meteorological data for strategic decision-making
        </p>
      </div>

      {/* District Selector */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select District
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DISTRICTS.map((district) => (
            <button
              key={district}
              onClick={() => setSelectedDistrict(district)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                selectedDistrict === district
                  ? 'bg-agri-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Metrics */}
      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Temperature (Avg)"
            value={latest.temp_avg.toFixed(1)}
            unit="°C"
            icon={<Cloud size={24} />}
            color="warning"
          />
          <StatCard
            label="Max Temperature"
            value={latest.temp_max.toFixed(1)}
            unit="°C"
            icon={<Cloud size={24} />}
            color="danger"
          />
          <StatCard
            label="Min Temperature"
            value={latest.temp_min.toFixed(1)}
            unit="°C"
            icon={<Cloud size={24} />}
            color="primary"
          />
          <StatCard
            label="Rainfall"
            value={latest.rainfall.toFixed(1)}
            unit="mm"
            icon={<Droplet size={24} />}
            color="primary"
          />
          <StatCard
            label="Humidity"
            value={latest.humidity.toFixed(0)}
            unit="%"
            icon={<Eye size={24} />}
            color="primary"
          />
          <StatCard
            label="Wind Speed"
            value={latest.wind_speed.toFixed(1)}
            unit="m/s"
            icon={<Wind size={24} />}
            color="primary"
          />
        </div>
      )}

      {/* Temperature Trend Chart */}
      <WeatherChart data={weatherData} loading={isLoading} />

      {/* Detailed Info */}
      {latest && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Detailed Weather Summary - {selectedDistrict}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Temperature</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Maximum:</span>
                  <span className="font-semibold text-red-600">
                    {latest.temp_max.toFixed(1)}°C
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average:</span>
                  <span className="font-semibold text-orange-600">
                    {latest.temp_avg.toFixed(1)}°C
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Minimum:</span>
                  <span className="font-semibold text-blue-600">
                    {latest.temp_min.toFixed(1)}°C
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Range:</span>
                  <span className="font-semibold text-gray-900">
                    {(latest.temp_max - latest.temp_min).toFixed(1)}°C
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Precipitation & Wind</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rainfall:</span>
                  <span className="font-semibold text-blue-600">
                    {latest.rainfall.toFixed(1)} mm
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Humidity:</span>
                  <span className="font-semibold text-cyan-600">
                    {latest.humidity.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Wind Speed:</span>
                  <span className="font-semibold text-teal-600">
                    {latest.wind_speed.toFixed(1)} m/s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(latest.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
