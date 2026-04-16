from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, List
from ..models.weather import WeatherSource


class WeatherReadingCreate(BaseModel):
    """Schema for creating weather readings."""
    district: str
    date: date
    temp_max: Optional[float] = None
    temp_min: Optional[float] = None
    temp_avg: Optional[float] = None
    solar_irradiance: Optional[float] = None
    evapotranspiration: Optional[float] = None
    humidity: Optional[float] = None
    precipitation: Optional[float] = None
    wind_speed: Optional[float] = None
    source: WeatherSource


class WeatherReadingResponse(BaseModel):
    """Schema for weather reading responses."""
    id: int
    district: str
    date: date
    temp_max: Optional[float] = None
    temp_min: Optional[float] = None
    temp_avg: Optional[float] = None
    solar_irradiance: Optional[float] = None
    evapotranspiration: Optional[float] = None
    humidity: Optional[float] = None
    precipitation: Optional[float] = None
    wind_speed: Optional[float] = None
    source: WeatherSource
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WeatherReadingListResponse(BaseModel):
    """Schema for listing weather readings."""
    items: List[WeatherReadingResponse]
    total: int
    skip: int
    limit: int


class ForecastResponse(BaseModel):
    """Schema for weather forecast responses."""
    district: str
    forecast_date: date
    temp_max: float
    temp_min: float
    precipitation_probability: float
    precipitation_mm: Optional[float] = None
    wind_speed: float


class ClimatologyResponse(BaseModel):
    """Schema for climatology data responses."""
    district: str
    month: int
    avg_temp: float
    avg_precipitation: float
    avg_humidity: float
    avg_wind_speed: float
