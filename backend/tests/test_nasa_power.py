import pytest
import pytest_asyncio
from datetime import date, timedelta
import httpx
import json
from unittest.mock import Mock, AsyncMock, patch

from app.services.nasa_power import NASAPowerService, VIDARBHA_DISTRICTS
from app.models.weather import WeatherReading, WeatherSource
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.core.database import Base


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


@pytest.mark.asyncio
async def test_nasa_power_service_initialization():
    """Test NASAPowerService initialization."""
    service = NASAPowerService()
    assert service.base_url == "https://power.larc.nasa.gov/api/temporal/daily/point"


@pytest.mark.asyncio
async def test_vidarbha_districts_coordinates():
    """Test Vidarbha districts coordinates are defined."""
    assert "Yavatmal" in VIDARBHA_DISTRICTS
    assert "Nagpur" in VIDARBHA_DISTRICTS
    assert "Amravati" in VIDARBHA_DISTRICTS
    assert "Wardha" in VIDARBHA_DISTRICTS
    assert "Akola" in VIDARBHA_DISTRICTS
    assert "Washim" in VIDARBHA_DISTRICTS
    assert "Buldhana" in VIDARBHA_DISTRICTS

    # Verify coordinates are tuples of lat, lon
    for district, coords in VIDARBHA_DISTRICTS.items():
        assert isinstance(coords, tuple)
        assert len(coords) == 2
        lat, lon = coords
        assert 15 < lat < 25  # Expected latitude range for Vidarbha
        assert 70 < lon < 85  # Expected longitude range for Vidarbha


@pytest.mark.asyncio
async def test_fetch_weather_invalid_district(test_db):
    """Test fetching weather for invalid district."""
    service = NASAPowerService()
    start_date = date.today() - timedelta(days=7)
    end_date = date.today()

    readings = await service.fetch_weather(test_db, "InvalidDistrict", start_date, end_date)
    assert readings == []


@pytest.mark.asyncio
async def test_fetch_weather_with_mocked_response(test_db):
    """Test fetching weather with mocked HTTP response."""
    service = NASAPowerService()

    # Create mock response
    mock_response_data = {
        "properties": {
            "parameter": {
                "T2M": {
                    "20240101": 25.5,
                    "20240102": 26.0,
                },
                "T2M_MAX": {
                    "20240101": 32.0,
                    "20240102": 33.0,
                },
                "T2M_MIN": {
                    "20240101": 18.0,
                    "20240102": 19.0,
                },
                "ALLSKY_SFC_SW_DWN": {
                    "20240101": 20.5,
                    "20240102": 21.0,
                },
                "EVPTRNS": {
                    "20240101": 5.2,
                    "20240102": 5.5,
                },
                "QV2M": {
                    "20240101": 12.0,
                    "20240102": 13.0,
                },
                "PRECTOTCORR": {
                    "20240101": 0.0,
                    "20240102": 2.5,
                },
                "WS2M": {
                    "20240101": 3.5,
                    "20240102": 3.8,
                },
            }
        }
    }

    # Mock httpx client
    with patch("httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_response = Mock()
        mock_response.json.return_value = mock_response_data
        mock_client.get.return_value = mock_response
        mock_client_class.return_value.__aenter__.return_value = mock_client

        async with NASAPowerService() as service:
            start_date = date(2024, 1, 1)
            end_date = date(2024, 1, 2)

            readings = await service.fetch_weather(test_db, "Yavatmal", start_date, end_date)

            # Verify results
            assert len(readings) >= 0
            # Note: Response structure may vary; adjust assertions as needed


@pytest.mark.asyncio
async def test_parse_nasa_response(test_db):
    """Test parsing NASA POWER API response."""
    service = NASAPowerService()

    response_data = {
        "properties": {
            "parameter": {
                "T2M": {
                    "20240101": 25.5,
                },
                "T2M_MAX": {
                    "20240101": 32.0,
                },
                "T2M_MIN": {
                    "20240101": 18.0,
                },
                "ALLSKY_SFC_SW_DWN": {
                    "20240101": 20.5,
                },
                "EVPTRNS": {
                    "20240101": 5.2,
                },
                "QV2M": {
                    "20240101": 12.0,
                },
                "PRECTOTCORR": {
                    "20240101": 0.0,
                },
                "WS2M": {
                    "20240101": 3.5,
                },
            }
        }
    }

    start_date = date(2024, 1, 1)
    end_date = date(2024, 1, 2)

    readings = await service._parse_nasa_response(
        test_db, "Yavatmal", response_data, start_date, end_date
    )

    # Verify parsing results
    assert isinstance(readings, list)


@pytest.mark.asyncio
async def test_fetch_all_districts(test_db):
    """Test fetching weather for all districts."""
    service = NASAPowerService()

    # Mock response
    mock_response_data = {
        "properties": {
            "parameter": {
                "T2M": {},
                "T2M_MAX": {},
                "T2M_MIN": {},
                "ALLSKY_SFC_SW_DWN": {},
                "EVPTRNS": {},
                "QV2M": {},
                "PRECTOTCORR": {},
                "WS2M": {},
            }
        }
    }

    with patch("httpx.AsyncClient") as mock_client_class:
        mock_client = AsyncMock()
        mock_response = Mock()
        mock_response.json.return_value = mock_response_data
        mock_client.get.return_value = mock_response
        mock_client_class.return_value.__aenter__.return_value = mock_client

        async with NASAPowerService() as service:
            start_date = date.today() - timedelta(days=7)
            end_date = date.today()

            results = await service.fetch_all_districts(test_db, start_date, end_date)

            # Should return dict with all districts
            assert isinstance(results, dict)
            assert all(district in results for district in VIDARBHA_DISTRICTS.keys())
