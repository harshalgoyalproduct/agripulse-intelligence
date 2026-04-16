'use client';

import { StatCard } from '@/components/StatCard';
import { TrendingUp, Target, Zap, AlertCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const yieldData = [
  { district: 'Yavatmal', current: 18.5, previous: 16.2, target: 20.0 },
  { district: 'Nagpur', current: 21.3, previous: 19.8, target: 23.0 },
  { district: 'Amravati', current: 17.8, previous: 16.5, target: 19.5 },
  { district: 'Wardha', current: 19.5, previous: 18.1, target: 21.0 },
];

const trendData = [
  { month: 'Jan', actual: 15, forecast: 16 },
  { month: 'Feb', actual: 16.5, forecast: 17 },
  { month: 'Mar', actual: 17.2, forecast: 18 },
  { month: 'Apr', actual: 18.1, forecast: 19 },
  { month: 'May', actual: 19.0, forecast: 20 },
];

export default function CropYieldPage() {
  const avgYield =
    yieldData.reduce((acc, d) => acc + d.current, 0) / yieldData.length;
  const totalPotential =
    yieldData.reduce((acc, d) => acc + d.target, 0) / yieldData.length;
  const gainPotential = totalPotential - avgYield;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Crop Yield Analytics</h1>
        <p className="text-gray-600 mt-2">
          Cotton yield estimation and optimization strategies for Vidarbha region
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Avg Current Yield"
          value={avgYield.toFixed(1)}
          unit="qtls/ha"
          icon={<TrendingUp size={24} />}
          color="success"
          change={8}
          subtext="Across all districts"
        />
        <StatCard
          label="Target Yield"
          value={totalPotential.toFixed(1)}
          unit="qtls/ha"
          icon={<Target size={24} />}
          color="primary"
          subtext="With optimal practices"
        />
        <StatCard
          label="Yield Gap"
          value={gainPotential.toFixed(1)}
          unit="qtls/ha"
          icon={<Zap size={24} />}
          color="warning"
          subtext="Improvement potential"
        />
        <StatCard
          label="Area Efficiency"
          value="87"
          unit="%"
          icon={<AlertCircle size={24} />}
          color="success"
          subtext="Optimal input usage"
        />
      </div>

      {/* Yield Comparison Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Yield by District (Current vs Target)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yieldData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="district" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Bar dataKey="current" fill="#ff8f00" name="Current (qtls/ha)" />
            <Bar dataKey="previous" fill="#cbd5e1" name="Previous (qtls/ha)" />
            <Bar dataKey="target" fill="#1b5e20" name="Target (qtls/ha)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Yield Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Yield Trend & Forecast
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
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
              dataKey="actual"
              stroke="#ff8f00"
              name="Actual Yield (qtls/ha)"
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#1b5e20"
              name="Forecast (qtls/ha)"
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* District-wise Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {yieldData.map((district) => (
          <div key={district.district} className="card">
            <h4 className="font-semibold text-gray-900 mb-4">
              {district.district}
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Current Yield</span>
                  <span className="font-semibold text-gray-900">
                    {district.current} qtls/ha
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-ff8f00 h-2 rounded-full"
                    style={{
                      width: `${(district.current / district.target) * 100}%`,
                      backgroundColor: '#ff8f00',
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Target Yield</span>
                  <span className="font-semibold text-gray-900">
                    {district.target} qtls/ha
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-agri-primary h-2 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm">
                  <span className="text-gray-600">Gap: </span>
                  <span className="font-semibold text-agri-primary">
                    {(district.target - district.current).toFixed(1)} qtls/ha
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {(
                    ((district.current - district.previous) / district.previous) *
                    100
                  ).toFixed(1)}
                  % increase from previous season
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yield Enhancement Strategies */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Strategies to Close Yield Gap
        </h3>
        <div className="space-y-4">
          <div className="border-l-4 border-agri-primary pl-4">
            <h4 className="font-semibold text-gray-900">Nutrient Management</h4>
            <p className="text-sm text-gray-700 mt-1">
              Optimize NPK ratios based on soil testing. Implement secondary nutrient
              application (Zn, B) during critical growth stages.
            </p>
          </div>
          <div className="border-l-4 border-agri-accent pl-4">
            <h4 className="font-semibold text-gray-900">
              Irrigation Scheduling
            </h4>
            <p className="text-sm text-gray-700 mt-1">
              Use weather-based irrigation scheduling to optimize water use efficiency.
              Critical stages: bud initiation to flowering.
            </p>
          </div>
          <div className="border-l-4 border-agri-success pl-4">
            <h4 className="font-semibold text-gray-900">
              Integrated Pest Management
            </h4>
            <p className="text-sm text-gray-700 mt-1">
              Reduce pest losses through early detection, biological controls, and
              targeted pesticide application.
            </p>
          </div>
          <div className="border-l-4 border-agri-warning pl-4">
            <h4 className="font-semibold text-gray-900">
              Variety Selection
            </h4>
            <p className="text-sm text-gray-700 mt-1">
              Use high-yielding, disease-resistant varieties suited to local agro-climatic
              conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
