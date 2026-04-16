import { useQuery } from '@tanstack/react-query';
import { apiClient, WeatherData } from '@/lib/api';

export function useWeather(district: string) {
  return useQuery<WeatherData[]>({
    queryKey: ['weather', district],
    queryFn: () => apiClient.getWeather(district),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}

export function useWeatherSummary() {
  return useQuery<WeatherData[]>({
    queryKey: ['weather-summary'],
    queryFn: () => apiClient.getWeatherSummary(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
