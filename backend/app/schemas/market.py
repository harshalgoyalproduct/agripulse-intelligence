from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List


class MandiPriceCreate(BaseModel):
    """Schema for creating mandi prices."""
    mandi_name: str
    district: str
    commodity: str
    date: date
    modal_price: float
    min_price: float
    max_price: float
    arrivals_tonnes: Optional[float] = None


class MandiPriceResponse(BaseModel):
    """Schema for mandi price responses."""
    id: int
    mandi_name: str
    district: str
    commodity: str
    date: date
    modal_price: float
    min_price: float
    max_price: float
    arrivals_tonnes: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MandiPriceListResponse(BaseModel):
    """Schema for listing mandi prices."""
    items: List[MandiPriceResponse]
    total: int
    skip: int
    limit: int


class PriceHistoryResponse(BaseModel):
    """Schema for price history."""
    commodity: str
    mandi_name: str
    date: date
    price: float
    trend: str  # "up", "down", "stable"


class PriceTrendResponse(BaseModel):
    """Schema for price trend analysis."""
    commodity: str
    current_price: float
    prev_month_avg: float
    prev_year_avg: float
    price_change_percent: float
    forecast_direction: str  # "bullish", "bearish", "neutral"
