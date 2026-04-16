from sqlalchemy import Column, String, Float, Integer, Index
from .base import BaseModel


class CropYield(BaseModel):
    """Historical crop yield data."""
    __tablename__ = "crop_yields"

    district = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False)
    season = Column(String(50), nullable=False)  # Kharif, Rabi, Summer
    year = Column(Integer, nullable=False, index=True)
    crop = Column(String(100), nullable=False, index=True)

    # Area and production
    area_hectares = Column(Float, nullable=False)
    production_tonnes = Column(Float, nullable=False)
    yield_kg_per_ha = Column(Float, nullable=False)

    __table_args__ = (
        Index('ix_crop_district_year', 'district', 'year'),
        Index('ix_crop_season', 'season'),
    )
