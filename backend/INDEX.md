# AgriPulse Intelligence Backend - File Index

## Documentation Files

- **README.md** - Complete backend documentation with features, setup, and API reference
- **QUICKSTART.md** - 5-minute quick start guide with common commands
- **IMPLEMENTATION.md** - Technical implementation details and architecture
- **INDEX.md** - This file

## Application Code Structure

### app/main.py
FastAPI application entry point with:
- CORS middleware configuration
- Lifespan management (startup/shutdown)
- Health check endpoint
- Router includes for all API modules
- Exception handlers

### app/core/ (Configuration & Database)
- **config.py** - Pydantic Settings with environment variables
- **database.py** - SQLAlchemy async engine, session factory, get_db dependency

### app/models/ (Data Models)
- **base.py** - Base model with id, created_at, updated_at
- **weather.py** - WeatherReading (10 fields + metadata)
- **satellite.py** - SatelliteReading (6 fields + metadata)
- **market.py** - MandiPrice (8 fields + metadata)
- **crop.py** - CropYield (7 fields + metadata)
- **alert.py** - Alert (6 fields + metadata)

### app/schemas/ (Pydantic Validation)
- **weather.py** - Create, Response, List, Forecast, Climatology schemas
- **satellite.py** - Create, Response, List, NDVI, SoilMoisture schemas
- **market.py** - Create, Response, List, PriceHistory, PriceTrend schemas

### app/services/ (External API Integration)
- **nasa_power.py** - FULLY IMPLEMENTED NASA POWER API service
  - Fetches 8 weather parameters for 7 Vidarbha districts
  - Database persistence with upsert logic
  - Error handling and logging
- **open_meteo.py** - FULLY IMPLEMENTED Open-Meteo forecast service
  - 16-day weather forecast
  - Response parsing
- **satellite_service.py** - Satellite service stubs with documented endpoints
  - fetch_ndvi() - Sentinel-2 CDSE
  - fetch_soil_moisture() - SMAP
  - fetch_vhi() - NOAA STAR
  - fetch_lst() - MODIS
  - fetch_evi() - MODIS EVI

### app/api/v1/ (REST API Endpoints)
- **weather.py** - 4 endpoints for weather data and forecasts
- **satellite.py** - 4 endpoints for satellite readings
- **market.py** - 4 endpoints for commodity prices
- **dashboard.py** - 3 endpoints for aggregated dashboards
- **alerts.py** - 6+ endpoints for alert management

## Testing

### tests/
- **conftest.py** - Pytest fixtures and test database setup
- **test_nasa_power.py** - NASA POWER service tests
- **test_weather_api.py** - Weather API endpoint tests

## Configuration Files

- **requirements.txt** - Python dependencies (14 packages)
- **Dockerfile** - Container configuration (Python 3.11 slim)
- **.env.example** - Environment variables template
- **.gitignore** - Git ignore patterns
- **.dockerignore** - Docker ignore patterns

## Quick Navigation

### To understand the system:
1. Start with **README.md**
2. Run through **QUICKSTART.md**
3. Review **IMPLEMENTATION.md** for technical details

### To work with the code:
- **app/main.py** - Entry point and routing
- **app/core/** - Configuration and database
- **app/services/nasa_power.py** - Main API integration example
- **app/api/v1/*.py** - API endpoints by domain

### To extend the system:
- Add new model to **app/models/**
- Add schema in **app/schemas/**
- Create service in **app/services/**
- Add routes in **app/api/v1/**
- Write tests in **tests/**

## Key Statistics

| Component | Count |
|-----------|-------|
| Python Files | 31 |
| Total Files | 39 |
| API Endpoints | 24+ |
| Data Models | 5 |
| External APIs (Full) | 2 |
| External APIs (Stub) | 5 |
| Test Cases | 20+ |

## Dependencies

- fastapi - Web framework
- uvicorn - ASGI server
- sqlalchemy - ORM
- asyncpg - PostgreSQL async driver
- httpx - HTTP client
- pydantic - Data validation
- pytest - Testing framework

## Running the Application

```bash
# Development server with auto-reload
uvicorn app.main:app --reload

# Production server
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app

# Docker container
docker build -t agripulse-backend .
docker run -p 8000:8000 -e DATABASE_URL="..." agripulse-backend
```

## API Documentation

Once running, open:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Support

All files are documented with:
- Comprehensive docstrings
- Type hints throughout
- Inline comments for complex logic
- Error handling and logging

