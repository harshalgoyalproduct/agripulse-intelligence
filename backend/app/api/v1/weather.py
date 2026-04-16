from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date, datetime, timedelta
from typing import List, Optional

from ...core.database import get_db
from ...models.weather import WeatherReading, WeatherSource
from ...schemas.weather import (
    WeatherReadingResponse,
    WeatherReadingListResponse,
    ForecastResponse,
    ClimatologyResponse,
)
from ...services.nasa_power import NASAPowerService
from ...services.open_meteo import OpenMeteoService

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/daily/{district}", response_model=WeatherReadingListResponse)
async def get_daily_weather(
    district: str,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(30, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
) -> WeatherReadingListResponse:
    """
    Get daily weather readings for a district.

    - **district**: District name (e.g., 'Yavatmal', 'Nagpur')
    - **start_date**: Start date (defaults to 30 days ago)
    - **end_date**: End date (defaults to today)
    - **skip**: Number of records to skip
    - **limit**: Number of records to return (max 365)
    """
    if start_date is None:
        start_date = date.today() - timedelta(days=30)
    if end_date is None:
        end_date = date.today()

    # Query weather readings
    stmt = (
        select(WeatherReading)
        .where(
            WeatherReading.district == district,
            WeatherReading.date >= start_date,
            WeatherReading.date <= end_date,
        )
        .order_by(WeatherReading.date.desc())
    )

    # Get total count
    count_stmt = select(WeatherReading).where(
        WeatherReading.district == district,
        WeatherReading.date >= start_date,
        WeatherReading.date <= end_date,
    )
    total = len(await db.scalars(count_stmt))

    # Apply pagination
    stmt = stmt.offset(skip).limit(limit)
    readings = await db.scalars(stmt)

    items = [WeatherReadingResponse.from_orm(r) for r in readings]

    return WeatherReadingListResponse(
        items=items,
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/forecast/{district}", response_model=List[ForecastResponse])
async def get_weather_forecast(
    district: str,
    days: int = Query(16, ge=1, le=16),
) -> List[ForecastResponse]:
    """
    Get 16-day weather forecast for a district.

    - **district**: District name (e.g., 'Yavatmal', 'Nagpur')
    - **days**: Number of forecast days (1-16, default 16)
    """
    async with OpenMeteoService() as service:
        forecasts = await service.fetch_forecast(district, days=days)

    if not forecasts:
        raise HTTPException(
            status_code=503,
            detail=f"Unable to fetch forecast data for {district}",
        )

    return forecasts


@router.get("/climatology/{district}", response_model=List[ClimatologyResponse])
async def get_climate_data(
    district: str,
    db: AsyncSession = Depends(get_db),
) -> List[ClimatologyResponse]:
    """
    Get monthly climatology (long-term averages) for a district.

    Returns 12 months of climatological data computed from historical records.
    """
    climatology = []

    for month in range(1, 13):
        # Query historical data for this month across all years
        stmt = select(WeatherReading).where(
            WeatherReading.district == district,
            WeatherReading.date.op("extract")("month") == month,
        )
        readings = await db.scalars(stmt)
        readings_list = list(readings)

        if not readings_list:
            continue

        # Calculate monthly averages
        avg_temp = sum(
            r.temp_avg for r in readings_list if r.temp_avg is not None
        ) / len([r for r in readings_list if r.temp_avg is not None] or [1])

        avg_precip = sum(
            r.precipitation for r in readings_list if r.precipitation is not None
        ) / len([r for r in readings_list if r.precipitation is not None] or [1])

        avg_humidity = sum(
            r.humidity for r in readings_list if r.humidity is not None
        ) / len([r for r in readings_list if r.humidity is not None] or [1])

        avg_wind = sum(
            r.wind_speed for r in readings_list if r.wind_speed is not None
        ) / len([r for r in readings_list if r.wind_speed is not None] or [1])

        climatology.append(
            ClimatologyResponse(
                district=district,
                month=month,
                avg_temp=avg_temp,
                avg_precipitation=avg_precip,
                avg_humidity=avg_humidity,
                avg_wind_speed=avg_wind,
            )
        )

    return climatology


@router.post("/refresh/{district}")
async def refresh_weather_data(
    district: str,
    days: int = Query(7, ge=1, le=30),
    db: AsyncSession = Depends(get_db),
):
    """
    Manually trigger a refresh of weather data from NASA POWER API.

    - **district**: District name
    - **days**: Number of days to fetch (default 7)
    """
    end_date = date.today()
    start_date = end_date - timedelta(days=days)

    async with NASAPowerService() as service:
        readings = await service.fetch_weather(db, district, start_date, end_date)

    return {
        "status": "success",
        "district": district,
        "records_fetched": len(readings),
        "date_range": f"{start_date} to {end_date}",
    }
