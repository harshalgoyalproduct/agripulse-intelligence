from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date, timedelta
from typing import List, Optional

from ...core.database import get_db
from ...models.market import MandiPrice
from ...schemas.market import (
    MandiPriceCreate,
    MandiPriceResponse,
    MandiPriceListResponse,
    PriceHistoryResponse,
    PriceTrendResponse,
)

router = APIRouter(prefix="/market", tags=["market"])


@router.get("/prices/{district}", response_model=MandiPriceListResponse)
async def get_mandi_prices(
    district: str,
    commodity: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
) -> MandiPriceListResponse:
    """
    Get mandi prices for a district.

    - **district**: District name
    - **commodity**: Filter by commodity (optional)
    - **start_date**: Start date (defaults to 30 days ago)
    - **end_date**: End date (defaults to today)
    - **skip**: Number of records to skip
    - **limit**: Number of records to return
    """
    if start_date is None:
        start_date = date.today() - timedelta(days=30)
    if end_date is None:
        end_date = date.today()

    # Build query
    stmt = select(MandiPrice).where(
        MandiPrice.district == district,
        MandiPrice.date >= start_date,
        MandiPrice.date <= end_date,
    )

    if commodity:
        stmt = stmt.where(MandiPrice.commodity == commodity)

    # Get total count
    count_stmt = select(MandiPrice).where(
        MandiPrice.district == district,
        MandiPrice.date >= start_date,
        MandiPrice.date <= end_date,
    )
    if commodity:
        count_stmt = count_stmt.where(MandiPrice.commodity == commodity)

    total = len(await db.scalars(count_stmt))

    # Apply pagination and ordering
    stmt = stmt.order_by(MandiPrice.date.desc()).offset(skip).limit(limit)
    prices = await db.scalars(stmt)

    items = [MandiPriceResponse.from_orm(p) for p in prices]

    return MandiPriceListResponse(
        items=items,
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/trends/{commodity}", response_model=PriceTrendResponse)
async def get_price_trends(
    commodity: str,
    district: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> PriceTrendResponse:
    """
    Get price trends for a commodity.

    Compares current price with monthly and yearly averages.
    """
    today = date.today()
    current_date = today
    prev_month = today - timedelta(days=30)
    prev_year = today - timedelta(days=365)

    # Current price (latest)
    stmt = (
        select(MandiPrice)
        .where(
            MandiPrice.commodity == commodity,
            MandiPrice.date == current_date,
        )
        .order_by(MandiPrice.date.desc())
        .limit(1)
    )
    if district:
        stmt = stmt.where(MandiPrice.district == district)

    current = await db.scalar(stmt)
    current_price = current.modal_price if current else 0

    # Previous month average
    month_stmt = select(func.avg(MandiPrice.modal_price)).where(
        MandiPrice.commodity == commodity,
        MandiPrice.date >= prev_month,
        MandiPrice.date < today,
    )
    if district:
        month_stmt = month_stmt.where(MandiPrice.district == district)

    prev_month_avg = float(await db.scalar(month_stmt)) if await db.scalar(month_stmt) else 0

    # Previous year average
    year_stmt = select(func.avg(MandiPrice.modal_price)).where(
        MandiPrice.commodity == commodity,
        MandiPrice.date >= prev_year,
        MandiPrice.date < today,
    )
    if district:
        year_stmt = year_stmt.where(MandiPrice.district == district)

    prev_year_avg = float(await db.scalar(year_stmt)) if await db.scalar(year_stmt) else 0

    # Calculate change
    if prev_month_avg > 0:
        price_change = ((current_price - prev_month_avg) / prev_month_avg) * 100
    else:
        price_change = 0

    # Determine direction
    if price_change > 5:
        forecast = "bullish"
    elif price_change < -5:
        forecast = "bearish"
    else:
        forecast = "neutral"

    return PriceTrendResponse(
        commodity=commodity,
        current_price=current_price,
        prev_month_avg=prev_month_avg,
        prev_year_avg=prev_year_avg,
        price_change_percent=price_change,
        forecast_direction=forecast,
    )


@router.get("/history/{commodity}", response_model=List[PriceHistoryResponse])
async def get_price_history(
    commodity: str,
    mandi_name: Optional[str] = Query(None),
    days: int = Query(90, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
) -> List[PriceHistoryResponse]:
    """
    Get historical prices for a commodity.

    - **commodity**: Commodity name
    - **mandi_name**: Specific mandi (optional)
    - **days**: Historical period in days
    """
    start_date = date.today() - timedelta(days=days)

    stmt = select(MandiPrice).where(
        MandiPrice.commodity == commodity,
        MandiPrice.date >= start_date,
    )

    if mandi_name:
        stmt = stmt.where(MandiPrice.mandi_name == mandi_name)

    stmt = stmt.order_by(MandiPrice.date.asc())
    prices = await db.scalars(stmt)
    prices_list = list(prices)

    history = []
    for i, price in enumerate(prices_list):
        # Determine trend
        if i == 0:
            trend = "stable"
        else:
            prev_price = prices_list[i - 1].modal_price
            if price.modal_price > prev_price * 1.02:
                trend = "up"
            elif price.modal_price < prev_price * 0.98:
                trend = "down"
            else:
                trend = "stable"

        history.append(
            PriceHistoryResponse(
                commodity=commodity,
                mandi_name=price.mandi_name,
                date=price.date,
                price=price.modal_price,
                trend=trend,
            )
        )

    return history


@router.post("/ingest")
async def ingest_mandi_prices(
    prices: List[MandiPriceCreate],
    db: AsyncSession = Depends(get_db),
):
    """
    Ingest mandi price data (admin endpoint).

    Accepts a list of mandi prices and stores them in the database.
    """
    try:
        for price_data in prices:
            price = MandiPrice(**price_data.model_dump())
            db.add(price)
        await db.commit()
        return {
            "status": "success",
            "records_ingested": len(prices),
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
