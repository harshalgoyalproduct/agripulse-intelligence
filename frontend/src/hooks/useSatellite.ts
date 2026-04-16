import { useQuery } from '@tanstack/react-query';
import { apiClient, SatelliteData } from '@/lib/api';

export function useSatellite(district: string) {
  return useQuery<SatelliteData[]>({
    queryKey: ['satellite', district],
    queryFn: () => apiClient.getSatelliteData(district),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useSatelliteSummary() {
  return useQuery<SatelliteData[]>({
    queryKey: ['satellite-summary'],
    queryFn: () => apiClient.getSatelliteSummary(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
