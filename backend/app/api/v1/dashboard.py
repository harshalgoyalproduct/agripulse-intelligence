from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date, datetime, timedelta
from typing import Optional, Dict, Any, List

from ...core.database import get_db
from ...models.weather import WeatherReading
from ...models.satellite import SatelliteReading
from ...models.market import MandiPrice
from ...models.alert import Alert
from ...schemas.weather import WeatherReadingResponse
from ...schemas.satellite import SatelliteReadingResponse
from ...schemas.market import MandiPriceResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class DashboardSummary:
    """Aggregated dashboard summary for a district."""

    def __init__(
        self,
        district: str,
        weather: Optional[WeatherReadingResponse] = None,
        satellite: Optional[SatelliteReadingResponse] = None,
        market: Optional[List[MandiPriceResponse]] = None,
        alerts: Optional[List[Alert]] = None,
    ):
        self.district = district
        self.weather = weather
        self.satellite = satellite
        self.market = market or []
        self.alerts = alerts or []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "district": self.district,
            "timestamp": datetime.utcnow(),
            "weather": {
                "date": self.weather.date if self.weather else None,
                "temp_max": self.weather.temp_max if self.weather else None,
                "temp_min": self.weather.temp_min if self.weather else None,
                "temp_avg": self.weather.temp_avg if self.weather else None,
                "precipitation": self.weather.precipitation if self.weather else None,
                "humidity": self.weather.humidity if self.weather else None,
                "wind_speed": self.weather.wind_speed if self.weather else None,
                "solar_irradiance": self.weather.solar_irradiance if self.weather else None,
                "evapotranspiration": self.weather.evapotranspiration
                if self.weather
                else None,
            },
            "satellite": {
                "date": self.satellite.date if self.satellite else None,
                "ndvi": self.satellite.ndvi if self.satellite else None,
                "evi": self.satellite.evi if self.satellite else None,
                "soil_moisture": self.satellite.soil_moisture if self.satellite else None,
                "vhi": self.satellite.vhi if self.satellite else None,
                "lst": self.satellite.lst if self.satellite else None,
            },
            "market": [
                {
                    "commodity": p.commodity,
                    "mandi_name": p.mandi_name,
                    "date": p.date,
                    "modal_price": p.modal_price,
                    "min_price": p.min_price,
                    "max_price": p.max_price,
                }
                for p in self.market
            ],
            "alerts": [
                {
                    "id": a.id,
                    "type": a.type,
                    "severity": a.severity,
                    "title": a.title,
                    "message": a.message,
                    "is_read": a.is_read,
                }
                for a in self.alerts
            ],
            "health_score": self._calculate_health_score(),
        }

    def _calculate_health_score(self) -> Dict[str, float]:
        """Calculate overall district health score based on aggregated data."""
        scores = {}

        # Weather health (0-100)
        if self.weather:
            temp_score = 100 if 20 <= (self.weather.temp_avg or 0) <= 35 else 50
            precip_score = 100 if 0 <= (self.weather.precipitation or 0) <= 100 else 50
            humidity_score = 100 if 40 <= (self.weather.humidity or 0) <= 80 else 50
            scores["weather"] = (temp_score + precip_score + humidity_score) / 3
        else:
            scores["weather"] = 0

        # Vegetation health (0-100)
        if self.satellite:
            ndvi = self.satellite.ndvi or 0
            ndvi_score = max(0, min(100, (ndvi + 1) * 50))  # Scale -1 to 1 to 0 to 100
            vhi = self.satellite.vhi or 0
            vhi_score = vhi  # Already 0-100
            scores["vegetation"] = (ndvi_score + vhi_score) / 2
        else:
            scores["vegetation"] = 0

        # Overall score
        if scores:
            scores["overall"] = sum(scores.values()) / len(scores)
        else:
            scores["overall"] = 0

        return scores


@router.get("/summary/{district}")
async def get_dashboard_summary(
    district: str,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get aggregated dashboard summary for a district.

    Combines latest weather, satellite, market, and alert data into a single response.

    Returns:
    - Current weather conditions
    - Satellite vegetation and soil indices
    - Current commodity prices from major mandis
    - Active alerts
    - Calculated health scores
    """
    today = date.today()

    # Get latest weather
    weather_stmt = (
        select(WeatherReading)
        .where(WeatherReading.district == district)
        .order_by(WeatherReading.date.desc())
        .limit(1)
    )
    latest_weather = await db.scalar(weather_stmt)
    weather_response = (
        WeatherReadingResponse.from_orm(latest_weather) if latest_weather else None
    )

    # Get latest satellite
    satellite_stmt = (
        select(SatelliteReading)
        .where(SatelliteReading.district == district)
        .order_by(SatelliteReading.date.desc())
        .limit(1)
    )
    latest_satellite = await db.scalar(satellite_stmt)
    satellite_response = (
        SatelliteReadingResponse.from_orm(latest_satellite) if latest_satellite else None
    )

    # Get today's market prices (latest from each commodity/mandi)
    market_stmt = (
        select(MandiPrice)
        .where(
            MandiPrice.district == district,
            MandiPrice.date == today,
        )
        .order_by(MandiPrice.commodity)
    )
    market_prices = await db.scalars(market_stmt)
    market_response = [MandiPriceResponse.from_orm(m) for m in market_prices]

    # Get active alerts
    alert_stmt = (
        select(Alert)
        .where(Alert.district == district, Alert.is_read == False)
        .order_by(Alert.severity.desc(), Alert.created_at.desc())
        .limit(10)
    )
    active_alerts = await db.scalars(alert_stmt)
    alerts_list = list(active_alerts)

    # Build summary
    summary = DashboardSummary(
        district=district,
        weather=weather_response,
        satellite=satellite_response,
        market=market_response,
        alerts=alerts_list,
    )

    return summary.to_dict()


@router.get("/forecast/{district}")
async def get_forecast_summary(
    district: str,
    days: int = Query(7, ge=1, le=30),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get forecast summary combining weather and trend predictions.

    Returns upcoming 7-30 day forecast with key metrics.
    """
    start_date = date.today() + timedelta(days=1)
    end_date = start_date + timedelta(days=days)

    # This would fetch forecast data from external APIs
    # For now, return structure with placeholder

    return {
        "district": district,
        "forecast_period": f"{start_date} to {end_date}",
        "data": [
            {
                "date": (start_date + timedelta(days=i)).isoformat(),
                "weather_forecast": None,  # Would fetch from Open-Meteo
                "alerts": [],
            }
            for i in range(days)
        ],
        "note": "Forecast data would be fetched from Open-Meteo API",
    }


@router.get("/compare")
async def compare_districts(
    districts: List[str] = Query([]),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Compare key metrics across multiple districts.

    Returns comparative analysis of weather, vegetation, and market conditions.
    """
    if not districts or len(districts) == 0:
        raise HTTPException(
            status_code=400,
            detail="At least one district required",
        )

    comparisons = {}

    for district in districts:
        # Get latest weather
        weather_stmt = (
            select(WeatherReading)
            .where(WeatherReading.district == district)
            .order_by(WeatherReading.date.desc())
            .limit(1)
        )
        latest_weather = await db.scalar(weather_stmt)

        # Get latest satellite
        satellite_stmt = (
            select(SatelliteReading)
            .where(SatelliteReading.district == district)
            .order_by(SatelliteReading.date.desc())
            .limit(1)
        )
        latest_satellite = await db.scalar(satellite_stmt)

        # Get latest prices
        market_stmt = (
            select(MandiPrice)
            .where(MandiPrice.district == district)
            .order_by(MandiPrice.date.desc())
            .limit(1)
        )
        latest_market = await db.scalar(market_stmt)

        comparisons[district] = {
            "weather": {
                "temp_avg": latest_weather.temp_avg if latest_weather else None,
                "precipitation": latest_weather.precipitation if latest_weather else None,
            },
            "vegetation": {
                "ndvi": latest_satellite.ndvi if latest_satellite else None,
                "vhi": latest_satellite.vhi if latest_satellite else None,
            },
            "market": {
                "latest_price": latest_market.modal_price if latest_market else None,
                "commodity": latest_market.commodity if latest_market else None,
            },
        }

    return {
        "timestamp": datetime.utcnow(),
        "districts": comparisons,
    }
