import pytest
import pytest_asyncio
from datetime import date, datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.models.weather import WeatherReading, WeatherSource


@pytest_asyncio.fixture
async def test_db():
    """Create test database."""
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        echo=False,
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        yield session

    await engine.dispose()


@pytest.fixture
def client(test_db):
    """Create test client."""

    async def override_get_db():
        yield test_db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()


def test_health_check(client):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root_endpoint(client):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "AgriPulse Intelligence"
    assert "api_docs" in data


@pytest.mark.asyncio
async def test_get_daily_weather_empty(client, test_db):
    """Test getting daily weather when no records exist."""
    response = client.get("/api/v1/weather/daily/Yavatmal")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["items"] == []


@pytest.mark.asyncio
async def test_get_daily_weather_with_data(client, test_db):
    """Test getting daily weather with data."""
    # Insert test data
    today = date.today()
    reading = WeatherReading(
        district="Yavatmal",
        date=today,
        temp_max=35.0,
        temp_min=20.0,
        temp_avg=27.5,
        solar_irradiance=20.5,
        evapotranspiration=5.2,
        humidity=60.0,
        precipitation=0.0,
        wind_speed=3.5,
        source=WeatherSource.NASA_POWER,
    )
    test_db.add(reading)
    await test_db.commit()

    response = client.get("/api/v1/weather/daily/Yavatmal")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["district"] == "Yavatmal"
    assert data["items"][0]["temp_max"] == 35.0


@pytest.mark.asyncio
async def test_get_daily_weather_with_date_range(client, test_db):
    """Test getting daily weather with date range filter."""
    # Insert test data
    for i in range(5):
        reading = WeatherReading(
            district="Nagpur",
            date=date.today() - timedelta(days=i),
            temp_max=35.0 - i,
            temp_min=20.0,
            temp_avg=27.5,
            solar_irradiance=20.5,
            humidity=60.0,
            precipitation=0.0,
            wind_speed=3.5,
            source=WeatherSource.NASA_POWER,
        )
        test_db.add(reading)
    await test_db.commit()

    start_date = (date.today() - timedelta(days=2)).isoformat()
    end_date = date.today().isoformat()

    response = client.get(
        f"/api/v1/weather/daily/Nagpur?start_date={start_date}&end_date={end_date}"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3  # 3 records within date range


@pytest.mark.asyncio
async def test_get_weather_forecast(client):
    """Test getting weather forecast."""
    response = client.get("/api/v1/weather/forecast/Yavatmal")
    # May return empty list if Open-Meteo mock is not set up
    assert response.status_code in [200, 503]


@pytest.mark.asyncio
async def test_get_climatology(client, test_db):
    """Test getting climatology data."""
    # Insert historical data for different months
    for month in range(1, 4):  # Jan, Feb, Mar
        for year in range(2021, 2024):
            reading = WeatherReading(
                district="Amravati",
                date=date(year, month, 15),
                temp_max=35.0,
                temp_min=20.0,
                temp_avg=27.5,
                humidity=60.0,
                precipitation=50.0,
                wind_speed=3.5,
                source=WeatherSource.NASA_POWER,
            )
            test_db.add(reading)
    await test_db.commit()

    response = client.get("/api/v1/weather/climatology/Amravati")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3  # 3 months


def test_weather_router_exists(client):
    """Test that weather router is properly included."""
    response = client.get("/api/v1/weather/daily/Yavatmal")
    # Should return 200 even if empty, not 404
    assert response.status_code == 200


def test_api_prefix_configuration(client):
    """Test API prefix is correctly configured."""
    # Check that routes are under /api/v1 prefix
    response = client.get("/api/v1/weather/daily/Yavatmal")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_pagination_skip_limit(client, test_db):
    """Test pagination with skip and limit parameters."""
    # Insert 10 records
    for i in range(10):
        reading = WeatherReading(
            district="Wardha",
            date=date.today() - timedelta(days=i),
            temp_max=35.0,
            temp_min=20.0,
            temp_avg=27.5,
            humidity=60.0,
            precipitation=0.0,
            wind_speed=3.5,
            source=WeatherSource.NASA_POWER,
        )
        test_db.add(reading)
    await test_db.commit()

    response = client.get("/api/v1/weather/daily/Wardha?skip=2&limit=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 3
    assert data["skip"] == 2
    assert data["limit"] == 3
    assert data["total"] == 10
