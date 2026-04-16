'use client';

import { useState } from 'react';
import { useMandiPrices } from '@/hooks/useDashboard';
import { MandiTable } from '@/components/MandiTable';
import { StatCard } from '@/components/StatCard';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

const DISTRICTS = ['All Districts', 'Yavatmal', 'Nagpur', 'Amravati', 'Wardha'];

export default function MarketPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(
    undefined
  );
  const { data: mandiPrices = [], isLoading } = useMandiPrices(selectedDistrict);

  const avgPrice =
    mandiPrices.reduce((acc, p) => acc + p.price, 0) / (mandiPrices.length || 1);
  const avgChange =
    mandiPrices.reduce((acc, p) => acc + p.price_change, 0) /
    (mandiPrices.length || 1);
  const totalVolume = mandiPrices.reduce((acc, p) => acc + p.volume, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Mandi Prices</h1>
        <p className="text-gray-600 mt-2">
          Real-time commodity prices and market trends across Vidarbha
        </p>
      </div>

      {/* District Selector */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Filter by District
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {DISTRICTS.map((district) => (
            <button
              key={district}
              onClick={() =>
                setSelectedDistrict(district === 'All Districts' ? undefined : district)
              }
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                (district === 'All Districts' && !selectedDistrict) ||
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

      {/* Market Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Avg Price"
          value={avgPrice.toFixed(0)}
          unit="₹"
          icon={<TrendingUp size={24} />}
          color="primary"
          change={avgChange}
        />
        <StatCard
          label="Price Volatility"
          value={Math.abs(avgChange).toFixed(1)}
          unit="%"
          icon={<BarChart3 size={24} />}
          color="warning"
        />
        <StatCard
          label="Total Volume"
          value={(totalVolume / 1000).toFixed(0)}
          unit="K units"
          icon={<Activity size={24} />}
          color="success"
        />
      </div>

      {/* Mandi Table */}
      <MandiTable data={mandiPrices} loading={isLoading} />

      {/* Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Commodities
          </h3>
          <div className="space-y-3">
            {Array.from(
              new Set(mandiPrices.map((p) => p.commodity))
            )
              .slice(0, 5)
              .map((commodity, idx) => {
                const commodityData = mandiPrices.filter(
                  (p) => p.commodity === commodity
                );
                const avgCommodityPrice =
                  commodityData.reduce((acc, p) => acc + p.price, 0) /
                  commodityData.length;
                return (
                  <div key={commodity} className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      {idx + 1}. {commodity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{avgCommodityPrice.toFixed(0)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Market Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Market Health</span>
                <span className="text-green-600 font-semibold">Stable</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-agri-success h-2 rounded-full"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Liquidity</span>
                <span className="text-agri-primary font-semibold">Good</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-agri-primary h-2 rounded-full"
                  style={{ width: '80%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Volatility</span>
                <span className="text-yellow-600 font-semibold">Moderate</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: '45%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
