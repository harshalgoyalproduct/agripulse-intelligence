import { useQuery } from '@tanstack/react-query';
import { apiClient, DashboardData } from '@/lib/api';

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.getDashboard(),
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => apiClient.getAlerts(),
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
  });
}

export function useMandiPrices(district?: string) {
  return useQuery({
    queryKey: ['mandi-prices', district],
    queryFn: () => apiClient.getMandiPrices(district),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
