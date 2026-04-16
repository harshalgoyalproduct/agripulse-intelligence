'use client';

import { useState } from 'react';
import { useSatellite } from '@/hooks/useSatellite';
import { SatellitePanel } from '@/components/SatellitePanel';

const DISTRICTS = ['Yavatmal', 'Nagpur', 'Amravati', 'Wardha'];

export default function SatellitePage() {
  const [selectedDistrict, setSelectedDistrict] = useState('Nagpur');
  const { data: satelliteData = [], isLoading } = useSatellite(selectedDistrict);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Satellite Intelligence
        </h1>
        <p className="text-gray-600 mt-2">
          NASA POWER data: Solar radiation, evapotranspiration, and climate metrics
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

      {/* Satellite Data Panel */}
      <SatellitePanel data={satelliteData} loading={isLoading} />

      {/* Information Card */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          About NASA POWER Data
        </h3>
        <div className="space-y-4 text-gray-700">
          <p>
            NASA POWER provides satellite-derived meteorological and solar data
            for agricultural applications in the Vidarbha region.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Solar Irradiance (MJ/m²)
              </h4>
              <p className="text-sm text-gray-600">
                Direct normal irradiance for assessing photosynthetically active
                radiation and crop growth potential.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Evapotranspiration (mm)
              </h4>
              <p className="text-sm text-gray-600">
                Water loss from soil and plants, critical for irrigation
                scheduling and water resource management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Relative Humidity (%)
              </h4>
              <p className="text-sm text-gray-600">
                Moisture in the air affecting pest pressure, disease incidence,
                and crop health.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Wind Speed (m/s)
              </h4>
              <p className="text-sm text-gray-600">
                Air movement affecting evaporation rates and spray drift in
                pesticide applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
