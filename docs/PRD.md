# AgriPulse Intelligence — Product Requirements Document

**Version**: 1.0  
**Status**: MVP Development  
**Last Updated**: April 2026  
**Author**: Product Team

---

## Executive Summary

AgriPulse Intelligence is a B2B SaaS platform that transforms India's ₹8B agri-input market by delivering real-time, satellite-powered demand forecasts. By combining NASA satellite imagery, weather data, and commodity pricing, we enable agri-input companies to optimize inventory allocation, reduce ₹500Cr+ annual losses, and empower farmers with data-driven decisions.

**Vision**: Make every agri-input decision in India data-driven by 2028.

---

## Problem Statement

### Market Problem

India's agri-input industry (fertilizers, seeds, pesticides, equipment) is highly inefficient:

- **Annual losses from inventory misallocation**: ₹500 Cr+
- **Demand forecasting accuracy**: <40% (based on manual rep reports)
- **Information asymmetry**: Sales reps operate with 2-week-old market intelligence
- **Regional supply-demand mismatches**: Excess inventory in declining regions, stockouts in high-demand areas
- **Smallholder farmer vulnerability**: Limited access to timely input recommendations, leading to poor yields

### Root Causes

1. **No real-time crop health data**: Decisions based on weather reports and gut feeling
2. **Manual demand estimation**: Sales reps estimate needs without objective crop data
3. **Delayed market signals**: Mandi prices are updated late; pest outbreaks go unnoticed until widespread
4. **Fragmented data sources**: No integrated view of satellite imagery, weather, prices, and pest alerts

### Target Segments & Opportunity

| Segment | Size | Problem | Opportunity |
|---------|------|---------|-------------|
| **Agri-input companies** | 8B market size | Inventory misallocation, inefficient reps | Demand forecasting → optimize stock + margins |
| **Government extension** | 50K+ officers, 60M+ farmer contacts | Limited data for policy + advisory | Real-time crop health intelligence |
| **Commodity traders** | 500K+ traders across India | Price volatility, working capital risk | Crop health trends → forward price signals |
| **Smallholder farmers** | 14M cotton farmers in India | Lack of timely input guidance | Cost-effective input recommendations |

**TAM**: ₹8B agri-input market × 3-5% IT adoption = ₹240-400Cr annual SaaS opportunity  
**SAM (India cotton)**: ₹500Cr annual cotton input market × 10% penetration = ₹50Cr addressable

---

## Target Personas

### 1. Rajesh — Agri-Input Sales Rep (PRIMARY)

**Profile**:
- Age: 35, Male, 12+ years experience
- Region: Vidarbha cotton belt (Akola, Amravati, Yavatmal districts)
- Manages: 2,000+ farmer accounts across ₹50L annual territory
- Education: 12th standard + agricultural diploma
- Tech: Smartphone (Android, basic data literacy), poor internet in field

**Pain Points**:
- Allocates inventory weekly based on *gossip* from farmer meetings
- Misses emerging problems: soil degradation, pest pressure, water stress until too late
- Loses sales to competitors with better market intelligence
- Cannot justify investment recommendations to farmers without data
- Spends 30+ hours/month on manual reporting

**Goals**:
- Predict which districts/taluqs need which inputs 5-7 days ahead
- Reduce stockouts (lost sales) and excess inventory (working capital loss)
- Win farmer trust with data-backed recommendations
- Cut reporting time by 50%

**Metrics**:
- Weekly active engagement: >80%
- Forecast accuracy: >70% (MAE < 10% of mean demand)
- Sales conversion: +20% vs. current baseline

---

### 2. Dr. Priya — District Agricultural Officer (SECONDARY)

**Profile**:
- Age: 42, Female, Government agriculture extension
- District: Yavatmal, Maharashtra
- Manages: 50,000+ farmers across 200 villages
- Education: BSc Agriculture + MSc (Soil Science)
- Tech: Laptop access, works from office + field visits

**Pain Points**:
- Advises on inputs based on historical patterns and individual farmer reports
- Cannot monitor crop health across full district in real-time
- Policy decisions on input subsidies made without live data
- No quantifiable data to support yield recommendations
- Reports to state agriculture department lack spatial crop health data

**Goals**:
- Monitor crop health status (NDVI, soil moisture, drought stress) across district
- Identify vulnerable areas early for targeted interventions
- Generate weekly crop health bulletins for farmers
- Support state-level agricultural policy with empirical data

**Metrics**:
- Weekly bulletin distribution: 50K+ farmers reached
- Advisory adoption rate: >40%
- Data-backed policy recommendations: 2+ per month

---

### 3. Vikram — Cotton Trader/Ginner

**Profile**:
- Age: 48, Male, 20+ years commodity trading experience
- Territory: Vidarbha region, manages procurement + ginning
- Manages: Relationships with 200+ cotton farmers, 5+ cotton gins
- Education: 10th standard + business experience
- Tech: Smartphone, WhatsApp, basic spreadsheets

**Pain Points**:
- Forecasts cotton demand/supply by intuition and informal networks
- Working capital locked in inventory due to demand uncertainty
- Cannot predict input use patterns that signal future crop yield
- Price volatility creates risk; no forward crop health signals
- Competition from larger traders with better information

**Goals**:
- Predict regional cotton crop health 30 days ahead
- Estimate harvest yield and timing to optimize ginning capacity
- Forward-signal price trends based on crop health (e.g., drought → lower yield → higher prices)
- Lock in procurement volumes 2-4 weeks early

**Metrics**:
- Price forecast accuracy: >65%
- Working capital optimization: -10% inventory days outstanding
- Procurement timing: 100% of crop harvested on schedule

---

### 4. Balu — Smallholder Farmer (AWARENESS)

**Profile**:
- Age: 58, Male, 2-hectare cotton farmer
- Region: Buldhana district, Vidarbha
- Household: Wife, 2 adult children (1 in city)
- Income: ₹40-60K annually
- Education: 6th standard
- Tech: Feature phone (voice + SMS), no internet

**Pain Points**:
- Input purchase decisions based on neighbor advice and local dealer recommendations
- Often buys wrong inputs or at wrong time (too early → overstock, too late → shortage)
- Limited knowledge of soil health, pest risks
- Cannot assess if recommendations are cost-effective
- Vulnerable to input dealer upselling

**Goals**:
- Get timely, personalized input recommendations (what, when, how much)
- Reduce input costs through informed purchases (avoid overuse)
- Increase cotton yield through better-timed interventions
- Access free or low-cost guidance from government/extension

**Metrics**:
- SMS engagement: 20% open rate
- Yield improvement: +10-15% for advisories followed
- Cost savings: ₹5-10K per season

---

## Solution Overview

### Core Innovation: Satellite-Powered Demand Intelligence

AgriPulse combines **4 layers of data** to predict input demand:

```
Layer 1: Crop Health (Satellite)
  ↓
Layer 2: Environmental Stress (Weather + Soil Moisture)
  ↓
Layer 3: Market Signals (Prices + Pest Alerts)
  ↓
Layer 4: Demand Forecast (ML Model)
```

### Data Sources & Update Frequency

| Source | Type | Update | Accuracy | Integration Phase |
|--------|------|--------|----------|---|
| **NASA POWER** | Temperature, humidity, radiation | Daily | ±2-3°C | MVP (Phase 1) |
| **Sentinel-2** | NDVI (vegetation index) | 5-10 days | 0.01 units (excellent) | Phase 3 |
| **MODIS** | Land surface temperature, NDVI | Daily | ±1-2°C | Phase 3 |
| **SMAP** | Soil moisture (0-5cm, 0-40cm) | Every 2-3 days | ±0.04 m³/m³ | Phase 4 |
| **NOAA VHI** | Vegetation health index (drought) | Weekly | 0-100 scale (normalized) | Phase 2 |
| **eNAM** | Mandi prices (50+ commodities) | Daily | Real-time agricultural market data | MVP |
| **CAI** | Historical cotton yields (1980-2025) | Annual | Validated by agricultural ministry | MVP baseline |
| **MOSDAC** | Pest/weather advisories | As issued | Government-issued alerts | Phase 2 |
| **Open-Meteo** | Weather forecasts (7-day) | Every 6 hours | ±1-2 days accuracy | MVP |

---

## MVP Scope (4-Week Sprint)

### Features (MVP v0.1)

#### 1. Dashboard (Sales Rep / Officer / Trader view)
- **District-level crop health visualization**
  - NDVI map with color coding (red/yellow/green)
  - 7-day weather forecast
  - Current soil moisture estimate
  - Pest alert summary
- **Demand forecast card**
  - 7-day and 30-day input demand predictions
  - Confidence intervals (±range)
  - Crop-wise breakdown (cotton, soybean, gram)
- **Mandi price tracker**
  - Last 7 days cotton prices (eNAM data)
  - Price trend (↑↓→)
  - Comparison to historical average

#### 2. Demand Forecasting API
- Endpoint: `GET /api/v1/forecasts/demand`
- Inputs: `district_id`, `crop`, `time_horizon` (7/30 days)
- Outputs:
  - `forecast_value` (units of input needed)
  - `confidence_interval` (lower, upper)
  - `drivers` (e.g., "Low soil moisture", "High temperature stress")

#### 3. Satellite Data Integration (NASA POWER)
- Live polling of NASA POWER API every 6 hours
- Cache latest 30 days of:
  - Daily maximum/minimum temperature
  - Relative humidity
  - Precipitation
  - Solar radiation
  - Wind speed
- Database: TimescaleDB time-series tables

#### 4. Mandi Price Integration (eNAM)
- Daily pull of cotton prices from 50+ mandis
- Track: Opening, closing, high, low, volume traded
- Compute: District-level average, trend, YoY comparison

#### 5. Basic Forecasting Model
- **Input features**:
  - Temperature (7-day rolling average)
  - Soil moisture proxy (from NDVI + rainfall)
  - Historical demand (seasonal baseline)
  - Price trends
  - Pest pressure (simple heuristic rules)
- **Output**: Demand forecast (units of fertilizer/pesticide needed)
- **Accuracy baseline**: >70% for 7-day forecasts (MAE < 10% of mean)
- **Model**: XGBoost (trained on 7 years CAI yield data + historical inputs)

#### 6. Basic User Management
- Three tiers: Sales Rep, Agri Officer, Trader
- Role-based dashboard views
- JWT authentication
- No SMS/email integration yet (manual distribution)

---

## Pricing Model

### B2B Tier (Agri-Input Companies)

| Plan | Price | Users | Features | Contract |
|------|-------|-------|----------|----------|
| **Starter** | ₹5K/month | 1 sales rep | Dashboard, 7-day forecast, mandi prices | Monthly |
| **Professional** | ₹20K/month | Up to 5 reps | All above + 30-day forecast, custom alerts, API access | Annual |
| **Enterprise** | ₹50K+/month | Unlimited | All above + white-label dashboard, bulk API, dedicated support | Custom |

### Government Tier (Agriculture Extension)

| Level | Price | Coverage | Features | Contract |
|-------|-------|----------|----------|----------|
| **District** | ₹2-5L/year | 1 district (50K farmers) | Weekly crop health bulletins, officer dashboard, API | Annual |
| **State** | ₹20-50L/year | Full state | All above + state-level analytics, policy support | Annual |

### Trader Tier (Commodity Trading)

| Plan | Price | Seats | Features | Contract |
|------|-------|-------|----------|----------|
| **Standard** | ₹10K/month | 2 traders | Demand forecast, price trends, yield estimates | Monthly |
| **Premium** | ₹30K/month | 5 traders | All above + forward contracts, API access, custom reports | Annual |

### Farmer Tier (Future - Free to SMS)

| Type | Price | Access | Features |
|------|-------|--------|----------|
| **Free** | ₹0 | SMS + Web | Weekly input recommendation, price alerts, pest alerts |
| **Premium** | ₹50/month | Web + Mobile App | Daily forecasts, field-level recommendations, yield tracking |

---

## Success Metrics

### Pilot Success Criteria (Weeks 1-4)

| Metric | Target | Owner | Measurement |
|--------|--------|-------|-------------|
| User sign-ups | 15 users (5 companies × 3 reps) | Product | Tracked in auth system |
| Weekly active users | 80% engagement | Product | Login + dashboard view |
| System uptime | 99.5% | DevOps | Monitoring dashboard |
| Data freshness | <4 hours (NASA POWER) | Backend | API latency logs |
| API response time | <500ms (p95) | Backend | APM monitoring |

### Post-Pilot Expansion (Months 2-6)

| Metric | Target | Owner | Measurement |
|--------|--------|-------|-------------|
| Demand forecast accuracy | >70% (MAE < 10% mean) | DS/ML | Backtesting on historical data |
| Net revenue retention | >100% | Sales | MRR growth quarter-over-quarter |
| Satellite integration coverage | 100% of Vidarbha (7 districts) | Product | Data ingestion logs |
| Feature adoption | 60% of users use forecasts | Product | Analytics dashboard |

---

## Competitive Landscape

### Existing Solutions

| Solution | Target | Model | Strength | Weakness | Positioning |
|----------|--------|-------|----------|----------|---|
| **Farmonaut** | Smallholder farmers | B2C | Field-level satellite imagery | No demand forecasting; high prices for farmers | Consumer-focused |
| **CropIn** | Large farming enterprises (100+ ha) | Enterprise SaaS | Yield management, traceability | High-touch, expensive; no input demand module | Enterprise play |
| **SatSure** | Lenders | B2B2C | Collateral valuation via satellite | Lending-focused; no demand forecasting | Risk management |
| **ISRO Bhuvan** | Government agencies | Free public portal | Free satellite data | No forecasting; poor UX for farmers | Government infrastructure |

### AgriPulse Differentiation

1. **Focus on B2B Input Demand** (not C2C or lending)
2. **Real-time, actionable forecasts** (not just imagery)
3. **Designed for India's agri-input market** (eNAM integration, mandi prices)
4. **Multi-stakeholder approach** (input companies, extension, traders, farmers)
5. **Cost-effective** (₹5-50K/month vs. ₹1-5L/month for enterprise solutions)

---

## High-Level Roadmap

### Phase 1: MVP (Weeks 1-4) — CURRENT

**Goal**: Validate core concept with 15 pilot users in Vidarbha

**Deliverables**:
- Dashboard with real-time weather, NDVI (via NASA POWER), mandi prices
- 7-day demand forecasts (XGBoost baseline model)
- Pilot user onboarding (5 agri-input companies)
- Basic monitoring and logging

**Success**: 15 users, 80% weekly engagement, >70% forecast accuracy

---

### Phase 2: Satellite Enhancement (Weeks 5-8)

**Goal**: Add NOAA VHI (drought indicators) and Sentinel-2 NDVI

**Deliverables**:
- NOAA VHI weekly integration
- Sentinel-2 NDVI (5-10 day cadence)
- Improved forecast accuracy (target: 75-80%)
- Pest outbreak alert integration

**Success**: Forecast accuracy >75%, new integrations live

---

### Phase 3: Soil Moisture & Yield (Weeks 9-12)

**Goal**: Integrate SMAP soil moisture and yield optimization

**Deliverables**:
- SMAP soil moisture (0-5cm, 0-40cm layers)
- Yield benchmarking (CAI data + satellite features)
- Advanced forecasting (Prophet + ensemble models)
- Government extension dashboard

**Success**: District agri officer adoption, >80% accuracy

---

### Phase 4: Farmer SMS Tier & Scale (Months 4-6)

**Goal**: Launch free SMS tier for smallholder farmers, expand to 5+ states

**Deliverables**:
- SMS gateway integration (CDAC/IVRS providers)
- Farmer SMS recommendations (localized, language support)
- Trader/commodity API tier
- Scale to Kharif-2026 season (50K farmers across India)

**Success**: 50K farmer registrations, commodity trader subscriptions, ₹10L MRR

---

## Database Schema (High-Level)

```sql
-- Districts in pilot (Vidarbha)
Table: districts
  - district_id (PK)
  - name
  - state
  - latitude
  - longitude
  - population_farmers
  - primary_crops

-- Crops
Table: crops
  - crop_id (PK)
  - name
  - category (cereal | pulses | oilseeds | cotton)
  - season (kharif | rabi | zaid)

-- Time-series: Satellite Data (NASA POWER)
Table: satellite_ndvi (TimescaleDB hypertable)
  - timestamp (time index)
  - district_id (FK)
  - ndvi_value
  - confidence
  - source (NASA_POWER | SENTINEL2 | MODIS)

-- Time-series: Weather Data
Table: weather_daily (TimescaleDB hypertable)
  - timestamp (time index)
  - district_id (FK)
  - temp_max
  - temp_min
  - humidity
  - rainfall_mm
  - wind_speed
  - solar_radiation

-- Time-series: Mandi Prices
Table: mandi_prices (TimescaleDB hypertable)
  - timestamp (time index)
  - district_id (FK)
  - crop_id (FK)
  - price_open
  - price_close
  - price_high
  - price_low
  - volume_traded
  - source (eNAM)

-- Demand Forecasts
Table: demand_forecasts
  - forecast_id (PK)
  - district_id (FK)
  - crop_id (FK)
  - forecast_date
  - horizon_days (7 | 30)
  - forecast_value
  - confidence_lower
  - confidence_upper
  - model_version
  - created_at

-- Users
Table: users
  - user_id (PK)
  - email
  - role (SALES_REP | AGRI_OFFICER | TRADER | ADMIN)
  - company_id (FK, nullable)
  - district_id (FK)
  - created_at
  - last_login

-- API Audit
Table: api_logs
  - log_id (PK)
  - user_id (FK)
  - endpoint
  - request_time
  - response_time_ms
  - status_code
```

---

## API Design Summary

### OpenAPI v3.0 Endpoints

#### Satellite Data
```
GET /api/v1/satellite/ndvi
  - Query: district_id, crop, days_back=7
  - Response: [{timestamp, ndvi, confidence}]

GET /api/v1/satellite/latest
  - Query: district_id
  - Response: {ndvi, vhi, soil_moisture_estimate, last_updated}
```

#### Forecasts
```
GET /api/v1/forecasts/demand
  - Query: district_id, crop, horizon=7
  - Response: {forecast, confidence_interval, drivers, accuracy}

GET /api/v1/forecasts/yield
  - Query: district_id, crop
  - Response: {yield_estimate, variance, vs_historical}
```

#### Market Data
```
GET /api/v1/mandi/prices
  - Query: crop, days_back=7, district_id (optional)
  - Response: [{timestamp, price, volume, trend}]

GET /api/v1/mandi/trends
  - Query: crop, months_back=12
  - Response: {current_price, avg_price, trend, seasonality}
```

#### Alerts
```
GET /api/v1/alerts/active
  - Query: district_id
  - Response: [{type, severity, description, action_recommended}]
```

#### Health
```
GET /api/v1/health
  - Response: {status, timestamp, dependencies: {postgres, nasa_api, enam_api}}
```

---

## Development Milestones

### Week 1-2: Foundation
- [ ] Database setup (PostgreSQL + TimescaleDB)
- [ ] Backend scaffold (FastAPI, models, schemas)
- [ ] Frontend scaffold (Next.js, layout, authentication)
- [ ] NASA POWER API integration (mock + real data)
- [ ] Mandi price ingestion (eNAM API)
- [ ] Basic dashboard UI (weather, prices, NDVI)

### Week 3-4: Forecasting & Polish
- [ ] Baseline XGBoost model training
- [ ] Forecast API endpoint + database persistence
- [ ] Pilot user onboarding (5 companies, 15 users)
- [ ] Monitoring + logging setup
- [ ] Documentation + API docs
- [ ] Docker deployment (docker-compose)
- [ ] Soft launch with pilot users

### Week 5-8: Phase 2
- [ ] NOAA VHI integration
- [ ] Sentinel-2 NDVI (API + processing)
- [ ] Improved forecasting accuracy
- [ ] Expanded pilot (30+ users)
- [ ] Mobile-responsive dashboard
- [ ] Pest alert system

### Month 4-6: Scale
- [ ] SMAP soil moisture
- [ ] Farmer SMS tier
- [ ] Expansion to 2-3 additional states
- [ ] Enterprise customer onboarding
- [ ] ₹10L MRR target

---

## Risk & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| NASA POWER API downtime | No new data for forecasting | Medium | Cache historical data; use secondary source (Open-Meteo) |
| Forecast accuracy < 70% | Pilot adoption failure | Medium | Use ensemble models (XGBoost + Prophet); invest in feature engineering |
| eNAM API unreliability | Stale mandi prices | High | Implement polling + fallback to CAI historical averages |
| Poor pilot user adoption | Cannot validate hypothesis | Medium | Close communication + weekly check-ins; incentivize engagement |
| Satellite data latency | Outdated information | Low | Implement caching + asynchronous updates; communicate delays clearly |
| Data privacy concerns | Regulatory issues, user trust | Medium | Document data handling; comply with GDPR + local regulations; no PII storage |

---

## Success Criteria for Production Launch

1. **Forecast Accuracy**: >75% for 7-day, >65% for 30-day forecasts
2. **User Engagement**: 80%+ weekly active for 2 consecutive months
3. **Data Freshness**: 99% of forecasts using data <4 hours old
4. **System Reliability**: 99.5%+ uptime
5. **Customer Acquisition**: 10+ paying companies (₹50K+ MRR)
6. **NPS Score**: >50 (promoters - detractors)

---

## Appendix: Data Accuracy & Projections

### Satellite Data Accuracy Trajectory

| Phase | Data Sources | Accuracy | Timeline |
|-------|--------------|----------|----------|
| Phase 1 (MVP) | NASA POWER (weather only) | 65% | Week 4 |
| Phase 2 | + NOAA VHI | 75% | Week 8 |
| Phase 3 | + Sentinel-2 NDVI, MODIS | 82% | Week 12 |
| Phase 4 | + SMAP soil moisture | 88% | Month 6 |

### Input Data for Accuracy Baseline

- Historical training data: 7 years cotton yield data (CAI) + manual input records (12 agri companies)
- Validation method: 5-fold cross-validation on 2022-2025 data
- Baseline model: XGBoost with NDVI, temperature, rainfall, prices as features
- Target: >70% accuracy (MAE < 10% of mean demand) for MVP

---

**Document Version**: 1.0  
**Next Review**: End of Week 4 (MVP Validation)  
**Contact**: product@agripulse.ai
