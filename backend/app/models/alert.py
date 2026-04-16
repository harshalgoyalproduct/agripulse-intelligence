from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum, Index, Text
from enum import Enum
from datetime import datetime
from .base import BaseModel


class AlertType(str, Enum):
    PEST = "PEST"
    WEATHER = "WEATHER"
    MARKET = "MARKET"
    SATELLITE = "SATELLITE"


class AlertSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Alert(BaseModel):
    """Alerts for farmers and stakeholders."""
    __tablename__ = "alerts"

    type = Column(SQLEnum(AlertType), nullable=False, index=True)
    severity = Column(SQLEnum(AlertSeverity), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    district = Column(String(100), nullable=False, index=True)

    is_read = Column(Boolean, nullable=False, default=False, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=True, index=True)

    __table_args__ = (
        Index('ix_alert_district_type', 'district', 'type'),
        Index('ix_alert_severity', 'severity'),
        Index('ix_alert_is_read', 'is_read'),
    )
