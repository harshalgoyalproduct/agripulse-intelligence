from sqlalchemy import Column, String, Float, Date, Enum as SQLEnum, Index
from enum import Enum
from datetime import date
from .base import BaseModel


class WeatherSource(str, Enum):
    NASA_POWER = "NASA_POWER"
    OPEN_METEO = "OPEN_METEO"
    IMD = "IMD"


class WeatherReading(BaseModel):
    """Weather data model for districts."""
    __tablename__ = "weather_readings"

    district = Column(String(100), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)

    # Temperature (Celsius)
    temp_max = Column(Float, nullable=True)
    temp_min = Column(Float, nullable=True)
    temp_avg = Column(Float, nullable=True)

    # Solar and evaporation
    solar_irradiance = Column(Float, nullable=True)  # MJ/m²/day
    evapotranspiration = Column(Float, nullable=True)  # mm/day

    # Humidity and precipitation
    humidity = Column(Float, nullable=True)  # %
    precipitation = Column(Float, nullable=True)  # mm

    # Wind
    wind_speed = Column(Float, nullable=True)  # m/s

    # Source
    source = Column(SQLEnum(WeatherSource), nullable=False)

    __table_args__ = (
        Index('ix_weather_district_date', 'district', 'date'),
        Index('ix_weather_source', 'source'),
    )
