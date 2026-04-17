'use client';

import { NDVIMap } from '../../components/NDVIMap';

export default function MapPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">District Map</h1>
        <p className="text-gray-600 mt-2">
          Spatial visualization of NDVI, crop health, and agro-climatic zones
        </p>
      </div>

      {/* NDVI Map */}
      <NDVIMap />

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            About NDVI
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            Normalized Difference Vegetation Index (NDVI) measures vegetation
            health and density using satellite data. Values range from -1 to +1.
          </p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              <strong>0.7+:</strong> Dense, healthy vegetation
            </li>
            <li>
              <strong>0.6-0.7:</strong> Good vegetation cover
            </li>
            <li>
              <strong>0.5-0.6:</strong> Moderate vegetation
            </li>
            <li>
              <strong>0-0.5:</strong> Sparse or stressed vegetation
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vidarbha Districts
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Yavatmal:</strong> Cotton belt center, 20.39°N, 78.13°E
            </p>
            <p>
              <strong>Nagpur:</strong> Primary market hub, 21.15°N, 79.09°E
            </p>
            <p>
              <strong>Amravati:</strong> Eastern region, 20.93°N, 77.75°E
            </p>
            <p>
              <strong>Wardha:</strong> Western region, 20.73°N, 78.60°E
            </p>
          </div>
        </div>
      </div>

      {/* Map Legend and Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Interpretation Guide
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Reading the Visualization
            </h4>
            <p className="text-sm text-gray-700">
              Each circle represents a district's current crop health based on
              latest satellite data. Darker green indicates better vegetation
              condition and higher crop productivity potential.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Decision-Making Use Cases
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                • <strong>Input Demand Planning:</strong> Green zones need maintenance
                nutrients; yellow/red zones need intensive management
              </li>
              <li>
                • <strong>Pest Management:</strong> Stressed areas (low NDVI) more
                susceptible to pests
              </li>
              <li>
                • <strong>Irrigation Scheduling:</strong> Monitor changes over time
                to optimize water application
              </li>
              <li>
                • <strong>Market Intelligence:</strong> Predict yield and adjust
                procurement strategies
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
