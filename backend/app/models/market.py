from sqlalchemy import Column, String, Float, Date, Index
from datetime import date
from .base import BaseModel


class MandiPrice(BaseModel):
    """Agricultural commodity prices from mandis."""
    __tablename__ = "mandi_prices"

    mandi_name = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    commodity = Column(String(100), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)

    # Price information (INR per quintal)
    modal_price = Column(Float, nullable=False)  # Most common price
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)

    # Volume
    arrivals_tonnes = Column(Float, nullable=True)

    __table_args__ = (
        Index('ix_mandi_district_date', 'district', 'date'),
        Index('ix_mandi_commodity', 'commodity'),
        Index('ix_mandi_mandi_name', 'mandi_name'),
    )
