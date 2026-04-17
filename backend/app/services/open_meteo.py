import httpx
import logging
from datetime import date, datetime, timedelta
from typing import List, Dict, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.weather import ForecastResponse
from ..core.config import settings
from .nasa_power import VIDARBHA_DISTRICTS, _VIDARBHA_DISTRICTS_RAW

logger = logging.getLogger(__name__)


class OpenMeteoService:
    """Service for Open-Meteo weather forecast API."""

    def __init__(self, base_url: str = settings.OPEN_METEO_BASE_URL):
        self.base_url = base_url
        self.client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        self.client = httpx.AsyncClient()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.client:
            await self.client.aclose()

    async def fetch_forecast(
        self,
        district: str,
        days: int = 16,
    ) -> List[ForecastResponse]:
        """
        Fetch 16-day weather forecast from Open-Meteo API.

        Open-Meteo forecast endpoint: https://api.open-meteo.com/v1/forecast

        Parameters:
        - latitude, longitude: coordinates
        - hourly/daily: weather variables
        - timezone: timezone for timestamps
        - forecast_days: 1-16 days

        Returns forecast as list of ForecastResponse objects.
        """
        if district not in VIDARBHA_DISTRICTS:
            logger.error(f"District {district} not found in VIDARBHA_DISTRICTS")
            return []

        lat, lon = VIDARBHA_DISTRICTS[district]

        # Open-Meteo parameters for daily forecast (comma-separated, not list)
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
            "timezone": "Asia/Kolkata",
            "forecast_days": min(days, 16),
        }

        try:
            if not self.client:
                self.client = httpx.AsyncClient()

            logger.info(f"Fetching Open-Meteo forecast for {district} ({lat}, {lon})")
            response = await self.client.get(
                f"{self.base_url}/forecast",
                params=params,
                timeout=30.0,
            )
            response.raise_for_status()

            data = response.json()
            forecasts = self._parse_forecast_response(district, data)

            logger.info(f"Successfully fetched {len(forecasts)} forecast records for {district}")
            return forecasts

        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching Open-Meteo forecast for {district}: {e}")
            return []
        except Exception as e:
            logger.error(f"Error fetching Open-Meteo forecast for {district}: {e}")
            return []

    def _parse_forecast_response(
        self,
        district: str,
        data: Dict[str, Any],
    ) -> List[ForecastResponse]:
        """Parse Open-Meteo forecast response."""
        forecasts = []

        try:
            daily = data.get("daily", {})

            times = daily.get("time", [])
            temp_max = daily.get("temperature_2m_max", [])
            temp_min = daily.get("temperature_2m_min", [])
            precip_sum = daily.get("precipitation_sum", [])
            precip_prob = daily.get("precipitation_probability_max", [])
            wind_speed = daily.get("wind_speed_10m_max", [])

            for i, time_str in enumerate(times):
                try:
                    forecast_date = datetime.strptime(time_str, "%Y-%m-%d").date()

                    forecast = ForecastResponse(
                        district=district,
                        forecast_date=forecast_date,
                        temp_max=float(temp_max[i]) if i < len(temp_max) else 0.0,
                        temp_min=float(temp_min[i]) if i < len(temp_min) else 0.0,
                        precipitation_probability=float(precip_prob[i])
                        if i < len(precip_prob)
                        else 0.0,
                        precipitation_mm=float(precip_sum[i])
                        if i < len(precip_sum)
                        else None,
                        wind_speed=float(wind_speed[i]) if i < len(wind_speed) else 0.0,
                    )
                    forecasts.append(forecast)

                except (ValueError, TypeError, IndexError) as e:
                    logger.error(f"Error parsing forecast for {time_str}: {e}")
                    continue

        except Exception as e:
            logger.error(f"Error parsing Open-Meteo response for {district}: {e}")

        return forecasts

    async def fetch_all_districts_forecast(
        self,
        days: int = 16,
    ) -> Dict[str, List[ForecastResponse]]:
        """Fetch weather forecast for all Vidarbha districts."""
        results = {}

        for district in _VIDARBHA_DISTRICTS_RAW.keys():
            forecasts = await self.fetch_forecast(district, days)
            results[district] = forecasts

        return results
