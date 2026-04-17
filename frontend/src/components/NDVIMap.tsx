'use client';

import { useEffect, useState } from 'react';

interface District {
  name: string;
  lat: number;
  lng: number;
  ndvi?: number;
  health?: string;
}

const VIDARBHA_DISTRICTS: District[] = [
  { name: 'Yavatmal', lat: 20.39, lng: 78.13, ndvi: 0.65, health: 'Good' },
  { name: 'Nagpur', lat: 21.15, lng: 79.09, ndvi: 0.72, health: 'Excellent' },
  { name: 'Amravati', lat: 20.93, lng: 77.75, ndvi: 0.58, health: 'Fair' },
  { name: 'Wardha', lat: 20.73, lng: 78.6, ndvi: 0.68, health: 'Good' },
];

const getColorForNDVI = (ndvi: number | undefined): string => {
  if (!ndvi) return '#ccc';
  if (ndvi >= 0.7) return '#059669';
  if (ndvi >= 0.6) return '#84cc16';
  if (ndvi >= 0.5) return '#eab308';
  return '#ef4444';
};

const getHealthStatus = (ndvi: number | undefined): string => {
  if (!ndvi) return 'N/A';
  if (ndvi >= 0.7) return 'Excellent';
  if (ndvi >= 0.6) return 'Good';
  if (ndvi >= 0.5) return 'Fair';
  return 'Poor';
};

function LeafletMap({ districts }: { districts: District[] }) {
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR window issues
    Promise.all([
      import('react-leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(([rl]) => {
      setMapComponents(rl);
    });
  }, []);

  if (!MapComponents) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Popup } = MapComponents;

  return (
    <MapContainer
      center={[21.0, 78.5]}
      zoom={8}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {districts.map((district: District) => (
        <CircleMarker
          key={district.name}
          center={[district.lat, district.lng]}
          radius={20}
          fillColor={getColorForNDVI(district.ndvi)}
          color={getColorForNDVI(district.ndvi)}
          weight={2}
          opacity={0.8}
          fillOpacity={0.7}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{district.name}</p>
              <p>NDVI: {district.ndvi?.toFixed(2)}</p>
              <p>Health: {getHealthStatus(district.ndvi)}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export function NDVIMap() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        NDVI & Crop Health Map
      </h3>
      <div className="relative h-96 rounded-lg overflow-hidden border border-gray-200">
        <LeafletMap districts={VIDARBHA_DISTRICTS} />
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#059669' }} />
          <span className="text-xs text-gray-700">Excellent (0.7+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#84cc16' }} />
          <span className="text-xs text-gray-700">Good (0.6-0.7)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#eab308' }} />
          <span className="text-xs text-gray-700">Fair (0.5-0.6)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }} />
          <span className="text-xs text-gray-700">Poor (0-0.5)</span>
        </div>
      </div>
    </div>
  );
}
