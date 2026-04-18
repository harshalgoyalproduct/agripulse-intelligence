const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
// Ensure we always hit /api/v1
const API_BASE_URL = RAW_BASE.endsWith('/api/v1')
  ? RAW_BASE
  : RAW_BASE.replace(/\/+$/, '') + '/api/v1';

// ─── Interfaces matching backend schemas ─────────────────────────

export interface WeatherReading {
  id: number;
  district: string;
  date: string;
  temp_max: number | null;
  temp_min: number | null;
  temp_avg: number | null;
  solar_irradiance: number | null;
  evapotranspiration: number | null;
  humidity: number | null;
  precipitation: number | null;
  wind_speed: number | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface WeatherListResponse {
  items: WeatherReading[];
  total: number;
  skip: number;
  limit: number;
}

export interface ForecastDay {
  district: string;
  forecast_date: string;
  temp_max: number;
  temp_min: number;
  precipitation_probability: number;
  precipitation_mm: number | null;
  wind_speed: number;
}

export interface MandiPriceRaw {
  id: number;
  mandi_name: string;
  district: string;
  commodity: string;
  date: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  arrivals_tonnes: number | null;
  created_at: string;
  updated_at: string;
}

export interface MandiPriceListResponse {
  items: MandiPriceRaw[];
  total: number;
  skip: number;
  limit: number;
}

export interface DashboardSummary {
  district: string;
  timestamp: string;
  weather: {
    date: string | null;
    temp_max: number | null;
    temp_min: number | null;
    temp_avg: number | null;
    precipitation: number | null;
    humidity: number | null;
    wind_speed: number | null;
    solar_irradiance: number | null;
    evapotranspiration: number | null;
  };
  satellite: {
    date: string | null;
    ndvi: number | null;
    evi: number | null;
    soil_moisture: number | null;
    vhi: number | null;
    lst: number | null;
  };
  market: Array<{
    commodity: string;
    mandi_name: string;
    date: string;
    modal_price: number;
    min_price: number;
    max_price: number;
  }>;
  alerts: Array<{
    id: number;
    type: string;
    severity: string;
    title: string;
    message: string;
    is_read: boolean;
  }>;
  health_score: {
    weather: number;
    vegetation: number;
    overall: number;
  };
}

export interface PriceTrend {
  commodity: string;
  current_price: number;
  prev_month_avg: number;
  prev_year_avg: number;
  price_change_percent: number;
  forecast_direction: string;
}

// ─── Frontend-friendly shapes (what components consume) ──────────

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

// ─── Helpers ─────────────────────────────────────────────────────

/** Filter out NASA POWER fill values (-999) */
function isValidReading(r: WeatherReading): boolean {
  return (
    r.temp_max !== null &&
    r.temp_max > -900 &&
    r.temp_min !== null &&
    r.temp_min > -900
  );
}

function toWeatherData(r: WeatherReading): WeatherData {
  return {
    date: r.date,
    temp_max: r.temp_max ?? 0,
    temp_min: r.temp_min ?? 0,
    temp_avg: r.temp_avg ?? 0,
    humidity: r.humidity ?? 0,
    rainfall: r.precipitation ?? 0,
    wind_speed: r.wind_speed ?? 0,
    district: r.district,
  };
}

function toSatelliteData(r: WeatherReading): SatelliteData {
  return {
    district: r.district,
    solar_irradiance: r.solar_irradiance ?? 0,
    et: r.evapotranspiration ?? 0,
    humidity: r.humidity ?? 0,
    wind_speed: r.wind_speed ?? 0,
    date: r.date,
  };
}

function toMandiPrice(r: MandiPriceRaw): MandiPrice {
  const spread = r.max_price - r.min_price;
  const changePercent = r.min_price > 0 ? (spread / r.min_price) * 100 : 0;
  return {
    id: String(r.id),
    market: r.mandi_name,
    commodity: r.commodity,
    date: r.date,
    price: r.modal_price,
    price_change: parseFloat(changePercent.toFixed(2)),
    volume: r.arrivals_tonnes ?? 0,
  };
}

// ─── API Client ──────────────────────────────────────────────────

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
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ── Weather ────────────────────────────────────────────────────

  async getWeather(district: string): Promise<WeatherData[]> {
    const resp = await this.request<WeatherListResponse>(
      `/weather/daily/${encodeURIComponent(district)}?limit=60`
    );
    return resp.items
      .filter(isValidReading)
      .map(toWeatherData)
      .reverse(); // oldest first for charts
  }

  async getWeatherSummary(): Promise<WeatherData[]> {
    // Fetch weather for default district (Nagpur) as summary
    return this.getWeather('Nagpur');
  }

  async getForecast(district: string, days = 16): Promise<ForecastDay[]> {
    return this.request<ForecastDay[]>(
      `/weather/forecast/${encodeURIComponent(district)}?days=${days}`
    );
  }

  // ── Satellite (uses NASA POWER weather data) ───────────────────

  async getSatelliteData(district: string): Promise<SatelliteData[]> {
    const resp = await this.request<WeatherListResponse>(
      `/weather/daily/${encodeURIComponent(district)}?limit=60`
    );
    return resp.items
      .filter(isValidReading)
      .map(toSatelliteData)
      .reverse();
  }

  async getSatelliteSummary(): Promise<SatelliteData[]> {
    return this.getSatelliteData('Nagpur');
  }

  // ── Market ─────────────────────────────────────────────────────

  async getMandiPrices(district?: string): Promise<MandiPrice[]> {
    const d = district || 'Yavatmal';
    const resp = await this.request<MandiPriceListResponse>(
      `/market/prices/${encodeURIComponent(d)}?limit=100`
    );
    return resp.items.map(toMandiPrice);
  }

  async getPriceTrend(commodity: string, district?: string): Promise<PriceTrend> {
    const q = district ? `?district=${encodeURIComponent(district)}` : '';
    return this.request<PriceTrend>(
      `/market/trends/${encodeURIComponent(commodity)}${q}`
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────

  async getDashboard(district = 'Nagpur'): Promise<DashboardData> {
    const raw = await this.request<DashboardSummary>(
      `/dashboard/summary/${encodeURIComponent(district)}`
    );
    const tempAvg =
      raw.weather.temp_avg && raw.weather.temp_avg > -900
        ? raw.weather.temp_avg
        : 0;
    const precip =
      raw.weather.precipitation && raw.weather.precipitation > -900
        ? raw.weather.precipitation
        : 0;
    return {
      total_alerts: raw.alerts.length,
      avg_temperature: tempAvg,
      rainfall_mm: precip,
      crop_health_index: raw.health_score.overall / 10,
      market_volatility: raw.market.length > 0 ? 12.5 : 0,
      predicted_demand: raw.market.length * 150,
    };
  }

  // ── Alerts ─────────────────────────────────────────────────────

  async getAlerts(): Promise<Alert[]> {
    try {
      const raw = await this.request<DashboardSummary>(
        '/dashboard/summary/Nagpur'
      );
      return raw.alerts.map((a) => ({
        id: String(a.id),
        type: (a.severity === 'critical'
          ? 'critical'
          : a.severity === 'high'
          ? 'warning'
          : 'info') as Alert['type'],
        title: a.title,
        description: a.message,
        timestamp: raw.timestamp,
      }));
    } catch {
      return [];
    }
  }

  async getAlertsByType(type: string): Promise<Alert[]> {
    const all = await this.getAlerts();
    return all.filter((a) => a.type === type);
  }
}

export const apiClient = new ApiClient();
