from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date, timedelta
from typing import List, Optional

from ...core.database import get_db
from ...models.satellite import SatelliteReading
from ...schemas.satellite import (
    SatelliteReadingResponse,
    SatelliteReadingListResponse,
    NDVIResponse,
    SoilMoistureResponse,
)
from ...services.satellite_service import SatelliteService

router = APIRouter(prefix="/satellite", tags=["satellite"])


@router.get("/readings/{district}", response_model=SatelliteReadingListResponse)
async def get_satellite_readings(
    district: str,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(30, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
) -> SatelliteReadingListResponse:
    """
    Get satellite readings for a district.

    - **district**: District name
    - **start_date**: Start date (defaults to 30 days ago)
    - **end_date**: End date (defaults to today)
    - **skip**: Number of records to skip
    - **limit**: Number of records to return
    """
    if start_date is None:
        start_date = date.today() - timedelta(days=30)
    if end_date is None:
        end_date = date.today()

    # Query satellite readings
    stmt = (
        select(SatelliteReading)
        .where(
            SatelliteReading.district == district,
            SatelliteReading.date >= start_date,
            SatelliteReading.date <= end_date,
        )
        .order_by(SatelliteReading.date.desc())
    )

    # Get total count
    count_stmt = select(SatelliteReading).where(
        SatelliteReading.district == district,
        SatelliteReading.date >= start_date,
        SatelliteReading.date <= end_date,
    )
    total = len(await db.scalars(count_stmt))

    # Apply pagination
    stmt = stmt.offset(skip).limit(limit)
    readings = await db.scalars(stmt)

    items = [SatelliteReadingResponse.from_orm(r) for r in readings]

    return SatelliteReadingListResponse(
        items=items,
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/ndvi/{district}", response_model=List[NDVIResponse])
async def get_ndvi_data(
    district: str,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> List[NDVIResponse]:
    """
    Get NDVI (Normalized Difference Vegetation Index) data.

    NDVI ranges from -1 to 1, where:
    - < 0.2: Water, barren, developed land
    - 0.2-0.4: Sparse vegetation
    - 0.4-0.6: Moderate vegetation
    - > 0.6: Dense vegetation
    """
    if start_date is None:
        start_date = date.today() - timedelta(days=90)
    if end_date is None:
        end_date = date.today()

    stmt = (
        select(SatelliteReading)
        .where(
            SatelliteReading.district == district,
            SatelliteReading.date >= start_date,
            SatelliteReading.date <= end_date,
            SatelliteReading.ndvi.isnot(None),
        )
        .order_by(SatelliteReading.date.asc())
    )

    readings = await db.scalars(stmt)
    readings_list = list(readings)

    ndvi_responses = []
    for i, reading in enumerate(readings_list):
        # Determine trend
        if i == 0:
            trend = "stable"
        else:
            prev_ndvi = readings_list[i - 1].ndvi
            if prev_ndvi is None:
                trend = "stable"
            elif reading.ndvi > prev_ndvi + 0.05:
                trend = "improving"
            elif reading.ndvi < prev_ndvi - 0.05:
                trend = "degrading"
            else:
                trend = "stable"

        ndvi_responses.append(
            NDVIResponse(
                district=district,
                date=reading.date,
                ndvi=reading.ndvi,
                trend=trend,
            )
        )

    return ndvi_responses


@router.get("/soil-moisture/{district}", response_model=List[SoilMoistureResponse])
async def get_soil_moisture_data(
    district: str,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> List[SoilMoistureResponse]:
    """
    Get soil moisture data with anomalies.

    Anomaly is calculated as the deviation from the long-term mean.
    """
    if start_date is None:
        start_date = date.today() - timedelta(days=90)
    if end_date is None:
        end_date = date.today()

    stmt = (
        select(SatelliteReading)
        .where(
            SatelliteReading.district == district,
            SatelliteReading.date >= start_date,
            SatelliteReading.date <= end_date,
            SatelliteReading.soil_moisture.isnot(None),
        )
        .order_by(SatelliteReading.date.asc())
    )

    readings = await db.scalars(stmt)
    readings_list = list(readings)

    if not readings_list:
        return []

    # Calculate long-term mean
    all_stmt = select(SatelliteReading).where(
        SatelliteReading.district == district,
        SatelliteReading.soil_moisture.isnot(None),
    )
    all_readings = await db.scalars(all_stmt)
    all_readings_list = list(all_readings)

    if all_readings_list:
        mean_moisture = sum(
            r.soil_moisture for r in all_readings_list if r.soil_moisture is not None
        ) / len([r for r in all_readings_list if r.soil_moisture is not None] or [1])
    else:
        mean_moisture = 0

    responses = []
    for reading in readings_list:
        anomaly = reading.soil_moisture - mean_moisture
        responses.append(
            SoilMoistureResponse(
                district=district,
                date=reading.date,
                soil_moisture=reading.soil_moisture,
                anomaly=anomaly,
            )
        )

    return responses


@router.post("/refresh/{district}")
async def refresh_satellite_data(
    district: str,
    data_type: str = Query("all", regex="^(all|ndvi|soil_moisture|vhi|lst)$"),
    db: AsyncSession = Depends(get_db),
):
    """
    Manually trigger a refresh of satellite data.

    - **district**: District name
    - **data_type**: Type of data to refresh (all, ndvi, soil_moisture, vhi, lst)
    """
    async with SatelliteService() as service:
        end_date = date.today()
        start_date = end_date - timedelta(days=30)

        results = {}

        if data_type in ["all", "ndvi"]:
            ndvi = await service.fetch_ndvi(db, district, start_date, end_date)
            results["ndvi"] = len(ndvi)

        if data_type in ["all", "soil_moisture"]:
            sm = await service.fetch_soil_moisture(db, district, start_date, end_date)
            results["soil_moisture"] = len(sm)

        if data_type in ["all", "vhi"]:
            vhi = await service.fetch_vhi(db, district, start_date, end_date)
            results["vhi"] = len(vhi)

        if data_type in ["all", "lst"]:
            lst = await service.fetch_lst(db, district, start_date, end_date)
            results["lst"] = len(lst)

    return {
        "status": "success",
        "district": district,
        "data_type": data_type,
        "results": results,
        "note": "Satellite services are stubbed. Implement API integration.",
    }
