import httpx
import logging
from datetime import datetime, date, timedelta
from typing import List, Dict, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.weather import WeatherReading, WeatherSource
from ..schemas.weather import WeatherReadingResponse
from ..core.config import settings

logger = logging.getLogger(__name__)


# Vidarbha district coordinates (lat, lon)
VIDARBHA_DISTRICTS = {
    "Yavatmal": (20.39, 78.13),
    "Nagpur": (21.15, 79.09),
    "Amravati": (20.93, 77.75),
    "Wardha": (20.73, 78.60),
    "Akola": (20.71, 77.00),
    "Washim": (20.11, 77.15),
    "Buldhana": (20.53, 76.18),
}


class NASAPowerService:
    """Service for NASA POWER API integration."""

    def __init__(self, base_url: str = settings.NASA_POWER_BASE_URL):
        self.base_url = base_url
        self.client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        self.client = httpx.AsyncClient()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.client:
            await self.client.aclose()

    async def fetch_weather(
        self,
        db: AsyncSession,
        district: str,
        start_date: date,
        end_date: date,
    ) -> List[WeatherReadingResponse]:
        """
        Fetch weather data from NASA POWER API for a district and date range.

        NASA POWER API endpoint: https://power.larc.nasa.gov/api/temporal/daily/point

        Parameters:
        - latitude, longitude: coordinates
        - start: YYYYMMDD format
        - end: YYYYMMDD format
        - parameters: comma-separated parameter codes

        Returns weather readings as list of WeatherReadingResponse objects.
        """
        if district not in VIDARBHA_DISTRICTS:
            logger.error(f"District {district} not found in VIDARBHA_DISTRICTS")
            return []

        lat, lon = VIDARBHA_DISTRICTS[district]

        # NASA POWER parameters we need
        parameters = [
            "T2M",  # Temperature at 2m
            "T2M_MAX",  # Max Temperature
            "T2M_MIN",  # Min Temperature
            "ALLSKY_SFC_SW_DWN",  # Solar irradiance
            "EVPTRNS",  # Evapotranspiration
            "QV2M",  # Specific humidity at 2m
            "PRECTOTCORR",  # Precipitation
            "WS2M",  # Wind speed at 2m
        ]

        params = {
            "parameters": ",".join(parameters),
            "latitude": lat,
            "longitude": lon,
            "start": start_date.strftime("%Y%m%d"),
            "end": end_date.strftime("%Y%m%d"),
            "community": "sb",
            "format": "json",
        }

        try:
            if not self.client:
                self.client = httpx.AsyncClient()

            logger.info(f"Fetching NASA POWER data for {district} ({lat}, {lon})")
            response = await self.client.get(self.base_url, params=params, timeout=30.0)
            response.raise_for_status()

            data = response.json()
            readings = await self._parse_nasa_response(
                db, district, data, start_date, end_date
            )

            logger.info(f"Successfully fetched {len(readings)} weather readings for {district}")
            return readings

        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching NASA POWER data for {district}: {e}")
            return []
        except Exception as e:
            logger.error(f"Error fetching NASA POWER data for {district}: {e}")
            return []

    async def _parse_nasa_response(
        self,
        db: AsyncSession,
        district: str,
        data: Dict[str, Any],
        start_date: date,
        end_date: date,
    ) -> List[WeatherReadingResponse]:
        """Parse NASA POWER API response and store in database."""
        readings = []

        try:
            # Extract properties from response
            properties = data.get("properties", {})
            daily_data = properties.get("parameter", {})

            if not daily_data:
                logger.warning(f"No parameter data in NASA POWER response for {district}")
                return []

            # Get the dates from the response
            dates_dict = {}
            for param_name, values in daily_data.items():
                # Values come as dict with date keys like "20230101"
                dates_dict.update(values)

            for date_str, _ in dates_dict.items():
                try:
                    reading_date = datetime.strptime(date_str, "%Y%m%d").date()

                    # Skip if outside requested range
                    if reading_date < start_date or reading_date > end_date:
                        continue

                    # Extract values for this date
                    temp_avg = daily_data.get("T2M", {}).get(date_str)
                    temp_max = daily_data.get("T2M_MAX", {}).get(date_str)
                    temp_min = daily_data.get("T2M_MIN", {}).get(date_str)
                    solar = daily_data.get("ALLSKY_SFC_SW_DWN", {}).get(date_str)
                    evap = daily_data.get("EVPTRNS", {}).get(date_str)
                    humidity = daily_data.get("QV2M", {}).get(date_str)
                    precip = daily_data.get("PRECTOTCORR", {}).get(date_str)
                    wind = daily_data.get("WS2M", {}).get(date_str)

                    # Check if record already exists
                    stmt = select(WeatherReading).where(
                        WeatherReading.district == district,
                        WeatherReading.date == reading_date,
                        WeatherReading.source == WeatherSource.NASA_POWER,
                    )
                    existing = await db.scalar(stmt)

                    if existing:
                        # Update existing record
                        existing.temp_avg = temp_avg
                        existing.temp_max = temp_max
                        existing.temp_min = temp_min
                        existing.solar_irradiance = solar
                        existing.evapotranspiration = evap
                        existing.humidity = humidity
                        existing.precipitation = precip
                        existing.wind_speed = wind
                        db.add(existing)
                    else:
                        # Create new record
                        reading = WeatherReading(
                            district=district,
                            date=reading_date,
                            temp_avg=temp_avg,
                            temp_max=temp_max,
                            temp_min=temp_min,
                            solar_irradiance=solar,
                            evapotranspiration=evap,
                            humidity=humidity,
                            precipitation=precip,
                            wind_speed=wind,
                            source=WeatherSource.NASA_POWER,
                        )
                        db.add(reading)

                except (ValueError, TypeError) as e:
                    logger.error(f"Error parsing date {date_str}: {e}")
                    continue

            # Commit changes
            await db.commit()

            # Fetch all saved readings for response
            stmt = select(WeatherReading).where(
                WeatherReading.district == district,
                WeatherReading.date >= start_date,
                WeatherReading.date <= end_date,
                WeatherReading.source == WeatherSource.NASA_POWER,
            )
            results = await db.scalars(stmt)
            readings = [WeatherReadingResponse.from_orm(r) for r in results]

        except Exception as e:
            await db.rollback()
            logger.error(f"Error parsing NASA POWER response for {district}: {e}")

        return readings

    async def fetch_all_districts(
        self,
        db: AsyncSession,
        start_date: date,
        end_date: date,
    ) -> Dict[str, List[WeatherReadingResponse]]:
        """Fetch weather data for all Vidarbha districts."""
        results = {}

        for district in VIDARBHA_DISTRICTS.keys():
            readings = await self.fetch_weather(db, district, start_date, end_date)
            results[district] = readings

        return results
