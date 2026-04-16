# AgriPulse Intelligence Backend

A production-quality FastAPI backend for B2B agri-input demand prediction, focused on the Vidarbha cotton belt in India.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── weather.py       # Weather endpoints
│   │       ├── satellite.py     # Satellite data endpoints
│   │       ├── market.py        # Mandi price endpoints
│   │       ├── dashboard.py     # Aggregated dashboard endpoints
│   │       └── alerts.py        # Alert management endpoints
│   ├── core/
│   │   ├── config.py            # Pydantic settings
│   │   └── database.py          # SQLAlchemy async setup
│   ├── models/
│   │   ├── base.py              # Base model with common fields
│   │   ├── weather.py           # WeatherReading model
│   │   ├── satellite.py         # SatelliteReading model
│   │   ├── market.py            # MandiPrice model
│   │   ├── crop.py              # CropYield model
│   │   └── alert.py             # Alert model
│   ├── schemas/
│   │   ├── weather.py           # Pydantic schemas for weather
│   │   ├── satellite.py         # Pydantic schemas for satellite
│   │   └── market.py            # Pydantic schemas for market
│   ├── services/
│   │   ├── nasa_power.py        # NASA POWER API integration
│   │   ├── open_meteo.py        # Open-Meteo forecast integration
│   │   └── satellite_service.py # Satellite data services
│   └── main.py                  # FastAPI app initialization
├── tests/
│   ├── conftest.py              # Pytest fixtures
│   ├── test_nasa_power.py       # NASA POWER service tests
│   └── test_weather_api.py      # Weather API endpoint tests
├── requirements.txt             # Python dependencies
├── Dockerfile                   # Container configuration
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## Features

### Core Components

#### 1. Weather Data
- **NASA POWER Integration**: Fetches daily weather from NASA POWER API
  - Temperature (max, min, avg)
  - Solar irradiance
  - Evapotranspiration
  - Humidity, precipitation, wind speed
- **Open-Meteo Forecasts**: 16-day weather forecasts
- **Climatology**: Long-term monthly averages

#### 2. Satellite Data
- **NDVI** (Normalized Difference Vegetation Index)
- **EVI** (Enhanced Vegetation Index)
- **Soil Moisture** (SMAP)
- **VHI** (Vegetation Health Index - NOAA)
- **LST** (Land Surface Temperature - MODIS)

#### 3. Market Data
- **Mandi Prices**: Agricultural commodity prices
  - Modal, min, max prices
  - Arrivals volume
  - Price trends and forecasts

#### 4. Alerts System
- **Alert Types**: PEST, WEATHER, MARKET, SATELLITE
- **Severity Levels**: LOW, MEDIUM, HIGH, CRITICAL
- **Features**: Read/unread status, expiration, batch operations

#### 5. Dashboard
- **Aggregated Summary**: Weather + Satellite + Market data
- **Health Scores**: Calculated from weather, vegetation, and market metrics
- **Comparative Analysis**: Compare metrics across districts

### Vidarbha Districts Covered
- Yavatmal (20.39°N, 78.13°E)
- Nagpur (21.15°N, 79.09°E)
- Amravati (20.93°N, 77.75°E)
- Wardha (20.73°N, 78.60°E)
- Akola (20.71°N, 77.00°E)
- Washim (20.11°N, 77.15°E)
- Buldhana (20.53°N, 76.18°E)

## Installation

### Prerequisites
- Python 3.11+
- PostgreSQL 12+ (for production)
- Docker (optional)

### Local Setup

1. **Clone repository**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

5. **Run migrations** (if using Alembic)
```bash
alembic upgrade head
```

6. **Start server**
```bash
uvicorn app.main:app --reload
```

Server will be available at `http://localhost:8000`

### Docker Setup

1. **Build image**
```bash
docker build -t agripulse-backend .
```

2. **Run container**
```bash
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql+asyncpg://user:pass@host:5432/db" \
  -e SECRET_KEY="your-secret-key" \
  agripulse-backend
```

## API Endpoints

### Weather
- `GET /api/v1/weather/daily/{district}` - Daily weather readings
- `GET /api/v1/weather/forecast/{district}` - 16-day forecast
- `GET /api/v1/weather/climatology/{district}` - Monthly climatology
- `POST /api/v1/weather/refresh/{district}` - Refresh data from NASA POWER

### Satellite
- `GET /api/v1/satellite/readings/{district}` - All satellite readings
- `GET /api/v1/satellite/ndvi/{district}` - NDVI data with trends
- `GET /api/v1/satellite/soil-moisture/{district}` - Soil moisture with anomalies
- `POST /api/v1/satellite/refresh/{district}` - Refresh satellite data

### Market
- `GET /api/v1/market/prices/{district}` - Mandi prices
- `GET /api/v1/market/trends/{commodity}` - Price trends
- `GET /api/v1/market/history/{commodity}` - Historical prices
- `POST /api/v1/market/ingest` - Ingest new price data

### Dashboard
- `GET /api/v1/dashboard/summary/{district}` - Aggregated summary
- `GET /api/v1/dashboard/forecast/{district}` - Forecast summary
- `GET /api/v1/dashboard/compare` - Compare multiple districts

### Alerts
- `GET /api/v1/alerts` - List alerts with filtering
- `GET /api/v1/alerts/{id}` - Get alert details
- `POST /api/v1/alerts` - Create alert
- `PATCH /api/v1/alerts/{id}/read` - Mark as read
- `DELETE /api/v1/alerts/{id}` - Delete alert
- `POST /api/v1/alerts/batch/mark-read` - Batch mark as read

### System
- `GET /health` - Health check
- `GET /docs` - Swagger UI documentation

## Data Models

### WeatherReading
```python
{
    "id": int,
    "district": str,
    "date": date,
    "temp_max": float,
    "temp_min": float,
    "temp_avg": float,
    "solar_irradiance": float,  # MJ/m²/day
    "evapotranspiration": float,  # mm/day
    "humidity": float,  # %
    "precipitation": float,  # mm
    "wind_speed": float,  # m/s
    "source": "NASA_POWER|OPEN_METEO|IMD",
    "created_at": datetime,
    "updated_at": datetime
}
```

### SatelliteReading
```python
{
    "id": int,
    "district": str,
    "date": date,
    "ndvi": float,  # -1 to 1
    "evi": float,
    "soil_moisture": float,
    "vhi": float,  # 0 to 100
    "lst": float,  # Kelvin or Celsius
    "source": "SENTINEL2|MODIS|SMAP|NOAA_VHI",
    "created_at": datetime,
    "updated_at": datetime
}
```

### MandiPrice
```python
{
    "id": int,
    "mandi_name": str,
    "district": str,
    "commodity": str,
    "date": date,
    "modal_price": float,  # INR/quintal
    "min_price": float,
    "max_price": float,
    "arrivals_tonnes": float,
    "created_at": datetime,
    "updated_at": datetime
}
```

### Alert
```python
{
    "id": int,
    "type": "PEST|WEATHER|MARKET|SATELLITE",
    "severity": "LOW|MEDIUM|HIGH|CRITICAL",
    "title": str,
    "message": str,
    "district": str,
    "is_read": bool,
    "expires_at": datetime | null,
    "created_at": datetime,
    "updated_at": datetime
}
```

## External API Integration

### NASA POWER
- **Endpoint**: https://power.larc.nasa.gov/api/temporal/daily/point
- **Parameters**: Fully implemented in `nasa_power.py`
- **Data**: Daily weather (T2M, solar, evaporation, etc.)
- **Status**: Production ready

### Open-Meteo
- **Endpoint**: https://api.open-meteo.com/v1/forecast
- **Parameters**: Latitude, longitude, daily variables, timezone
- **Data**: 16-day weather forecast
- **Status**: Production ready

### Satellite Services (TODO - Stubs with documented endpoints)
- **Sentinel-2 CDSE**: NDVI calculation from bands B4 (Red) and B8 (NIR)
- **SMAP**: Soil moisture at 36km resolution
- **NOAA VHI**: Weekly vegetation health data
- **MODIS**: LST and EVI from MOD11A2, MOD13Q1 products

## Testing

### Run Tests
```bash
pytest tests/
pytest tests/test_nasa_power.py -v
pytest tests/test_weather_api.py -v
```

### Test Coverage
```bash
pytest --cov=app tests/
```

## Configuration

### Environment Variables
See `.env.example` for all options:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key (change in production!)
- `DEBUG`: Enable debug mode (False in production)
- `ENVIRONMENT`: "development", "staging", "production"
- `ALLOWED_ORIGINS`: CORS allowed origins

## Performance Considerations

1. **Async Database Access**: All DB operations use async SQLAlchemy
2. **Connection Pooling**: Configured with 20 pool size, 40 overflow
3. **Indexing**: Composite indexes on district+date for fast queries
4. **Pagination**: All list endpoints support skip/limit
5. **Caching**: (Ready for implementation with Redis)

## Database Schema

Key indexes:
- `weather_readings`: idx_weather_district_date, idx_weather_source
- `satellite_readings`: idx_satellite_district_date, idx_satellite_source
- `mandi_prices`: idx_mandi_district_date, idx_mandi_commodity
- `alerts`: idx_alert_district_type, idx_alert_severity, idx_alert_is_read

## Deployment

### Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Change `SECRET_KEY` to random value
- [ ] Configure PostgreSQL with backups
- [ ] Set up HTTPS/TLS
- [ ] Configure logging to persistent storage
- [ ] Set up monitoring and alerting
- [ ] Configure rate limiting
- [ ] Add authentication (JWT tokens)
- [ ] Set up database migrations workflow

### Docker Compose Example
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://agripulse:pass@postgres:5432/agripulse
    depends_on:
      - postgres
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: agripulse
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: agripulse
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

## Contributing

1. Follow PEP 8 style guide
2. Add tests for new features
3. Update documentation
4. Use async/await for all I/O operations
5. Handle errors with appropriate HTTP status codes

## License

AgriPulse Intelligence (C) 2024
