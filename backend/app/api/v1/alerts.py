from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from datetime import datetime, timedelta
from typing import List, Optional

from ...core.database import get_db
from ...models.alert import Alert, AlertType, AlertSeverity
from pydantic import BaseModel

router = APIRouter(prefix="/alerts", tags=["alerts"])


class AlertCreate(BaseModel):
    """Schema for creating alerts."""
    type: AlertType
    severity: AlertSeverity
    title: str
    message: str
    district: str
    expires_at: Optional[datetime] = None


class AlertResponse(BaseModel):
    """Schema for alert responses."""
    id: int
    type: AlertType
    severity: AlertSeverity
    title: str
    message: str
    district: str
    is_read: bool
    created_at: datetime
    updated_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AlertListResponse(BaseModel):
    """Schema for listing alerts."""
    items: List[AlertResponse]
    total: int
    unread_count: int


@router.get("", response_model=AlertListResponse)
async def list_alerts(
    district: Optional[str] = Query(None),
    alert_type: Optional[AlertType] = Query(None),
    severity: Optional[AlertSeverity] = Query(None),
    is_read: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
) -> AlertListResponse:
    """
    List alerts with optional filtering.

    - **district**: Filter by district
    - **alert_type**: Filter by alert type (PEST, WEATHER, MARKET, SATELLITE)
    - **severity**: Filter by severity (LOW, MEDIUM, HIGH, CRITICAL)
    - **is_read**: Filter by read status
    - **skip**: Number of records to skip
    - **limit**: Number of records to return
    """
    stmt = select(Alert).where(Alert.expires_at > datetime.utcnow() or Alert.expires_at.is_(None))

    if district:
        stmt = stmt.where(Alert.district == district)
    if alert_type:
        stmt = stmt.where(Alert.type == alert_type)
    if severity:
        stmt = stmt.where(Alert.severity == severity)
    if is_read is not None:
        stmt = stmt.where(Alert.is_read == is_read)

    # Get total count before pagination
    count_stmt = select(Alert).where(Alert.expires_at > datetime.utcnow() or Alert.expires_at.is_(None))
    if district:
        count_stmt = count_stmt.where(Alert.district == district)
    if alert_type:
        count_stmt = count_stmt.where(Alert.type == alert_type)
    if severity:
        count_stmt = count_stmt.where(Alert.severity == severity)
    if is_read is not None:
        count_stmt = count_stmt.where(Alert.is_read == is_read)

    total = len(await db.scalars(count_stmt))

    # Get unread count
    unread_stmt = select(Alert).where(Alert.is_read == False)
    unread_count = len(await db.scalars(unread_stmt))

    # Apply ordering and pagination
    stmt = stmt.order_by(Alert.severity.desc(), Alert.created_at.desc()).offset(skip).limit(limit)
    alerts = await db.scalars(stmt)

    items = [AlertResponse.from_orm(a) for a in alerts]

    return AlertListResponse(
        items=items,
        total=total,
        unread_count=unread_count,
    )


@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(
    alert_id: int,
    db: AsyncSession = Depends(get_db),
) -> AlertResponse:
    """Get a specific alert by ID."""
    stmt = select(Alert).where(Alert.id == alert_id)
    alert = await db.scalar(stmt)

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    return AlertResponse.from_orm(alert)


@router.post("", response_model=AlertResponse)
async def create_alert(
    alert_data: AlertCreate,
    db: AsyncSession = Depends(get_db),
) -> AlertResponse:
    """Create a new alert."""
    alert = Alert(
        type=alert_data.type,
        severity=alert_data.severity,
        title=alert_data.title,
        message=alert_data.message,
        district=alert_data.district,
        expires_at=alert_data.expires_at,
    )

    db.add(alert)
    await db.commit()
    await db.refresh(alert)

    return AlertResponse.from_orm(alert)


@router.patch("/{alert_id}/read", response_model=AlertResponse)
async def mark_alert_read(
    alert_id: int,
    db: AsyncSession = Depends(get_db),
) -> AlertResponse:
    """Mark an alert as read."""
    stmt = select(Alert).where(Alert.id == alert_id)
    alert = await db.scalar(stmt)

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.is_read = True
    db.add(alert)
    await db.commit()
    await db.refresh(alert)

    return AlertResponse.from_orm(alert)


@router.patch("/{alert_id}/unread", response_model=AlertResponse)
async def mark_alert_unread(
    alert_id: int,
    db: AsyncSession = Depends(get_db),
) -> AlertResponse:
    """Mark an alert as unread."""
    stmt = select(Alert).where(Alert.id == alert_id)
    alert = await db.scalar(stmt)

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.is_read = False
    db.add(alert)
    await db.commit()
    await db.refresh(alert)

    return AlertResponse.from_orm(alert)


@router.post("/batch/mark-read")
async def mark_alerts_read(
    alert_ids: List[int],
    db: AsyncSession = Depends(get_db),
):
    """Mark multiple alerts as read."""
    stmt = update(Alert).where(Alert.id.in_(alert_ids)).values(is_read=True)
    result = await db.execute(stmt)
    await db.commit()

    return {
        "status": "success",
        "alerts_updated": result.rowcount,
    }


@router.delete("/{alert_id}")
async def delete_alert(
    alert_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete an alert."""
    stmt = select(Alert).where(Alert.id == alert_id)
    alert = await db.scalar(stmt)

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    await db.delete(alert)
    await db.commit()

    return {"status": "success", "message": "Alert deleted"}


@router.post("/batch/delete")
async def delete_alerts(
    alert_ids: List[int],
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple alerts."""
    stmt = select(Alert).where(Alert.id.in_(alert_ids))
    alerts = await db.scalars(stmt)

    for alert in alerts:
        await db.delete(alert)

    await db.commit()

    return {
        "status": "success",
        "alerts_deleted": len(alert_ids),
    }


@router.get("/district/{district}/active")
async def get_active_alerts_by_district(
    district: str,
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Get active alerts for a specific district."""
    stmt = (
        select(Alert)
        .where(
            Alert.district == district,
            Alert.is_read == False,
            (Alert.expires_at > datetime.utcnow()) | (Alert.expires_at.is_(None)),
        )
        .order_by(Alert.severity.desc(), Alert.created_at.desc())
        .limit(limit)
    )

    alerts = await db.scalars(stmt)
    items = [AlertResponse.from_orm(a) for a in alerts]

    return {
        "district": district,
        "count": len(items),
        "alerts": items,
    }
