const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface WeatherData {
  date: string;
  temp_max: number;
  temp_min: number;
  temp_avg: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  district: string;
}

export interface SatelliteData {
  district: string;
  solar_irradiance: number;
  et: number;
  humidity: number;
  wind_speed: number;
  date: string;
}

export interface MandiPrice {
  id: string;
  market: string;
  commodity: string;
  date: string;
  price: number;
  price_change: number;
  volume: number;
}

export interface DashboardData {
  total_alerts: number;
  avg_temperature: number;
  rainfall_mm: number;
  crop_health_index: number;
  market_volatility: number;
  predicted_demand: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  district?: string;
  timestamp: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Weather endpoints
  async getWeather(district: string): Promise<WeatherData[]> {
    return this.request<WeatherData[]>(`/weather?district=${district}`);
  }

  async getWeatherSummary(): Promise<WeatherData[]> {
    return this.request<WeatherData[]>('/weather/summary');
  }

  // Satellite endpoints
  async getSatelliteData(district: string): Promise<SatelliteData[]> {
    return this.request<SatelliteData[]>(`/satellite?district=${district}`);
  }

  async getSatelliteSummary(): Promise<SatelliteData[]> {
    return this.request<SatelliteData[]>('/satellite/summary');
  }

  // Market endpoints
  async getMandiPrices(district?: string): Promise<MandiPrice[]> {
    const query = district ? `?district=${district}` : '';
    return this.request<MandiPrice[]>(`/market/prices${query}`);
  }

  async getMarketData(): Promise<MandiPrice[]> {
    return this.request<MandiPrice[]>('/market/data');
  }

  // Dashboard endpoints
  async getDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>('/dashboard');
  }

  // Alerts endpoints
  async getAlerts(): Promise<Alert[]> {
    return this.request<Alert[]>('/alerts');
  }

  async getAlertsByType(type: string): Promise<Alert[]> {
    return this.request<Alert[]>(`/alerts?type=${type}`);
  }
}

export const apiClient = new ApiClient();
