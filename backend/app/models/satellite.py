from sqlalchemy import Column, String, Float, Date, Enum as SQLEnum, Index
from enum import Enum
from datetime import date
from .base import BaseModel


class SatelliteSource(str, Enum):
    SENTINEL2 = "SENTINEL2"
    MODIS = "MODIS"
    SMAP = "SMAP"
    NOAA_VHI = "NOAA_VHI"


class SatelliteReading(BaseModel):
    """Satellite imagery data model."""
    __tablename__ = "satellite_readings"

    district = Column(String(100), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)

    # Vegetation indices
    ndvi = Column(Float, nullable=True)  # Normalized Difference Vegetation Index (-1 to 1)
    evi = Column(Float, nullable=True)  # Enhanced Vegetation Index

    # Soil and water
    soil_moisture = Column(Float, nullable=True)  # % or mm
    vhi = Column(Float, nullable=True)  # Vegetation Health Index (0-100)

    # Land surface temperature
    lst = Column(Float, nullable=True)  # Kelvin or Celsius

    # Source
    source = Column(SQLEnum(SatelliteSource), nullable=False)

    __table_args__ = (
        Index('ix_satellite_district_date', 'district', 'date'),
        Index('ix_satellite_source', 'source'),
    )
