# AgriPulse Intelligence Backend - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env - at minimum set:
# DATABASE_URL=sqlite+aiosqlite:///agripulse.db  (for testing)
# or use PostgreSQL for production
```

### 3. Run Application
```bash
uvicorn app.main:app --reload
```

Server starts at: **http://localhost:8000**

## Endpoints to Try

### Health Check
```bash
curl http://localhost:8000/health
```

### API Documentation
Open browser: **http://localhost:8000/docs** (Swagger UI)

### Weather API Examples
```bash
# Get daily weather (last 30 days)
curl http://localhost:8000/api/v1/weather/daily/Yavatmal

# Get 16-day forecast
curl http://localhost:8000/api/v1/weather/forecast/Nagpur

# Refresh weather data from NASA POWER
curl -X POST http://localhost:8000/api/v1/weather/refresh/Amravati
```

### Dashboard
```bash
# Get aggregated summary for a district
curl http://localhost:8000/api/v1/dashboard/summary/Wardha
```

### Alerts
```bash
# Get all active alerts
curl http://localhost:8000/api/v1/alerts

# Create an alert
curl -X POST http://localhost:8000/api/v1/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "type": "WEATHER",
    "severity": "HIGH",
    "title": "Heavy Rain Warning",
    "message": "Expect 50mm rainfall in next 24 hours",
    "district": "Yavatmal"
  }'
```

## What's Implemented

✓ **Weather Services**
- NASA POWER API integration (fully working)
- Open-Meteo forecasts (fully working)
- Historical climatology

✓ **Data Models**
- WeatherReading, SatelliteReading, MandiPrice, CropYield, Alert
- All with proper indexes and relationships

✓ **API Endpoints** (24 endpoints total)
- Weather: daily, forecast, climatology, refresh
- Satellite: readings, ndvi, soil-moisture, refresh
- Market: prices, trends, history
- Dashboard: summary, forecast, compare
- Alerts: full CRUD with batch operations

✓ **External APIs**
- NASA POWER: Fully implemented and tested
- Open-Meteo: Fully implemented
- Sentinel-2 CDSE: Documented (stub)
- SMAP: Documented (stub)
- NOAA VHI: Documented (stub)

✓ **Database**
- Async SQLAlchemy with connection pooling
- Proper indexes for performance
- Transaction management
- Support for PostgreSQL or SQLite

✓ **Testing**
- NASA POWER service tests
- Weather API endpoint tests
- Pytest fixtures for database

## Database Setup (PostgreSQL)

```bash
# Create database
createdb agripulse

# Connection string for .env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/agripulse
```

For testing with SQLite:
```
DATABASE_URL=sqlite+aiosqlite:///agripulse.db
```

## Running Tests
```bash
pytest tests/
pytest tests/test_nasa_power.py -v
pytest tests/test_weather_api.py -v
```

## Docker

Build and run in container:
```bash
docker build -t agripulse-backend .
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql+asyncpg://user:pass@postgres:5432/agripulse" \
  -e SECRET_KEY="your-secret-key" \
  agripulse-backend
```

## Key Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/docs` | GET | Interactive API docs |
| `/api/v1/weather/daily/{district}` | GET | Daily weather |
| `/api/v1/weather/forecast/{district}` | GET | 16-day forecast |
| `/api/v1/dashboard/summary/{district}` | GET | Aggregated dashboard |
| `/api/v1/alerts` | GET/POST | Manage alerts |
| `/api/v1/market/prices/{district}` | GET | Mandi prices |

## District Coordinates Hardcoded

The system covers these Vidarbha districts:
- Yavatmal (20.39°N, 78.13°E)
- Nagpur (21.15°N, 79.09°E)
- Amravati (20.93°N, 77.75°E)
- Wardha (20.73°N, 78.60°E)
- Akola (20.71°N, 77.00°E)
- Washim (20.11°N, 77.15°E)
- Buldhana (20.53°N, 76.18°E)

## NASA POWER API

The NASA POWER integration is fully functional:

```python
from app.services.nasa_power import NASAPowerService
from datetime import date, timedelta

async with NASAPowerService() as service:
    readings = await service.fetch_weather(
        db=session,
        district="Yavatmal",
        start_date=date.today() - timedelta(days=7),
        end_date=date.today()
    )
    # Returns list of WeatherReadingResponse objects
```

## Production Deployment

1. **Set environment variables**
   - Change SECRET_KEY to random value
   - Set DEBUG=False
   - Configure DATABASE_URL for PostgreSQL

2. **Use production ASGI server**
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
   ```

3. **Set up reverse proxy** (nginx/Apache)
   - Proxy to localhost:8000
   - Enable HTTPS/TLS
   - Configure CORS origins

4. **Database backups**
   - Set up PostgreSQL automated backups
   - Test restoration

5. **Monitoring**
   - Set up application logging
   - Configure error tracking (Sentry)
   - Set up APM if needed

## File Structure
```
backend/
├── app/
│   ├── api/v1/          # 5 routers (weather, satellite, market, dashboard, alerts)
│   ├── models/          # 6 data models (weather, satellite, market, crop, alert, base)
│   ├── schemas/         # 3 schema files (weather, satellite, market)
│   ├── services/        # 3 service files (NASA POWER, Open-Meteo, Satellite)
│   ├── core/            # config.py, database.py
│   └── main.py          # FastAPI app
├── tests/               # 2 test files + conftest.py
├── requirements.txt     # 14 dependencies
├── Dockerfile           # Container config
├── README.md            # Full documentation
├── IMPLEMENTATION.md    # Technical details
└── QUICKSTART.md        # This file
```

## Common Issues & Solutions

### Port Already in Use
```bash
# Use different port
uvicorn app.main:app --port 8001
```

### Database Connection Error
```bash
# Check DATABASE_URL in .env
# For SQLite (testing):
DATABASE_URL=sqlite+aiosqlite:///agripulse.db

# For PostgreSQL:
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/agripulse
```

### Module Import Errors
```bash
# Ensure you're in the backend directory
cd backend

# Or use full module path
python -m uvicorn app.main:app
```

## Next Steps

1. **Test the API**: Use Swagger UI at `/docs`
2. **Fetch real data**: Use POST `/api/v1/weather/refresh/{district}`
3. **Set up database**: Configure PostgreSQL for production
4. **Add authentication**: Implement JWT token validation
5. **Configure alerts**: Create alert rules for crop conditions
6. **Integrate frontend**: Connect to React/Vue frontend on port 3000

## Support

- Full API documentation: `/docs`
- OpenAPI schema: `/openapi.json`
- README: `README.md`
- Implementation details: `IMPLEMENTATION.md`
