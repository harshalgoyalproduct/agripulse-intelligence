from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List
from ..models.satellite import SatelliteSource


class SatelliteReadingCreate(BaseModel):
    """Schema for creating satellite readings."""
    district: str
    date: date
    ndvi: Optional[float] = None
    evi: Optional[float] = None
    soil_moisture: Optional[float] = None
    vhi: Optional[float] = None
    lst: Optional[float] = None
    source: SatelliteSource


class SatelliteReadingResponse(BaseModel):
    """Schema for satellite reading responses."""
    id: int
    district: str
    date: date
    ndvi: Optional[float] = None
    evi: Optional[float] = None
    soil_moisture: Optional[float] = None
    vhi: Optional[float] = None
    lst: Optional[float] = None
    source: SatelliteSource
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SatelliteReadingListResponse(BaseModel):
    """Schema for listing satellite readings."""
    items: List[SatelliteReadingResponse]
    total: int
    skip: int
    limit: int


class NDVIResponse(BaseModel):
    """Schema for NDVI data response."""
    district: str
    date: date
    ndvi: float
    trend: str  # "improving", "degrading", "stable"


class SoilMoistureResponse(BaseModel):
    """Schema for soil moisture response."""
    district: str
    date: date
    soil_moisture: float
    anomaly: float
