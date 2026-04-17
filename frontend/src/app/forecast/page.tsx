'use client';

import { useDashboard } from '../../hooks/useDashboard';
import { StatCard } from '../../components/StatCard';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const forecastData = [
  { day: 'Day 1-3', fertilizer: 1200, pesticide: 450, seeds: 300 },
  { day: 'Day 4-7', fertilizer: 1400, pesticide: 520, seeds: 280 },
  { day: 'Day 8-11', fertilizer: 1100, pesticide: 480, seeds: 350 },
  { day: 'Day 12-14', fertilizer: 1300, pesticide: 510, seeds: 320 },
];

export default function ForecastPage() {
  const { data: dashboard } = useDashboard();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Demand Forecast
        </h1>
        <p className="text-gray-600 mt-2">
          14-day agri-input demand predictions using weather and market data
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Predicted Demand"
          value={dashboard?.predicted_demand?.toFixed(0) ?? '-'}
          unit="units"
          icon={<Target size={24} />}
          color="success"
          change={22}
          subtext="14-day forecast"
        />
        <StatCard
          label="Confidence Level"
          value="87"
          unit="%"
          icon={<Zap size={24} />}
          color="primary"
          subtext="ML model accuracy"
        />
        <StatCard
          label="Forecast Period"
          value="14"
          unit="days"
          icon={<Calendar size={24} />}
          color="primary"
          subtext="Planning horizon"
        />
        <StatCard
          label="Trend Direction"
          value="↑"
          icon={<TrendingUp size={24} />}
          color="success"
          change={12}
          subtext="Upward momentum"
        />
      </div>

      {/* Forecast Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Input Demand Forecast (14 Days)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Bar dataKey="fertilizer" fill="#1b5e20" name="Fertilizer (units)" />
            <Bar dataKey="pesticide" fill="#ff8f00" name="Pesticide (units)" />
            <Bar dataKey="seeds" fill="#059669" name="Seeds (units)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fertilizer Demand
          </h3>
          <div className="space-y-4">
            {forecastData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.day}</p>
                  <p className="text-sm text-gray-600">Predicted: {item.fertilizer} units</p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full w-24">
                  <div
                    className="bg-agri-primary h-2 rounded-full"
                    style={{
                      width: `${(item.fertilizer / 1500) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pesticide & Seeds Demand
          </h3>
          <div className="space-y-4">
            {forecastData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.day}</p>
                  <p className="text-sm text-gray-600">
                    Pesticide: {item.pesticide} | Seeds: {item.seeds} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Factors Influencing Demand */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Factors Influencing Demand
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Weather Conditions</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Optimal rainfall predicted</li>
              <li>✓ Favorable temperature range</li>
              <li>⚠ High humidity alerts</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Crop Health</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ NDVI above threshold</li>
              <li>⚠ Pest pressure increasing</li>
              <li>✓ Disease incidence low</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Market Conditions</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Prices trending upward</li>
              <li>✓ Strong mandi demand</li>
              <li>✓ Good market liquidity</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card border-2 border-agri-accent">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Strategic Recommendations
        </h3>
        <div className="space-y-3 text-gray-700">
          <p>
            1. <strong>Increase fertilizer stock</strong> - Demand forecasted to rise 22% over
            next 14 days. Consider bulk purchases at current price levels.
          </p>
          <p>
            2. <strong>Prepare pesticide inventory</strong> - Humidity levels increasing, pest
            pressure expected to rise. Stock broad-spectrum options.
          </p>
          <p>
            3. <strong>Secure seed supply</strong> - Demand relatively stable. Focus on
            high-yielding varieties suited to current weather patterns.
          </p>
          <p>
            4. <strong>Monitor market closely</strong> - Volatility moderate. Best time to
            negotiate contracts with farmers and retailers.
          </p>
        </div>
      </div>
    </div>
  );
}
