# AgriPulse Intelligence — Cloud Deployment Guide

Three deployment options, ranked by simplicity. All work with the existing codebase — no rewrites needed.

---

## Option 1: Render (Recommended — Easiest)

**Why:** One-click deploy from GitHub. Free tier covers MVP. Built-in Postgres. No credit card needed.

**Free tier:** 750 hrs/month per service, 256MB RAM, PostgreSQL 256MB, auto-sleep after 15 min inactivity.

### Steps

```bash
# 1. Push repo to GitHub (if not already done)
cd agripulse-app
git init -b main && git add -A
git commit -m "Initial commit: AgriPulse Intelligence MVP"
gh repo create agripulse-intelligence --public --source=. --push

# 2. Deploy on Render
# Go to: https://render.com/deploy
# Click "New Blueprint Instance"
# Connect your GitHub repo
# Render auto-detects render.yaml and creates:
#   - agripulse-db (PostgreSQL)
#   - agripulse-api (FastAPI backend)
#   - agripulse-web (Next.js frontend)

# 3. That's it. Your URLs will be:
#   Frontend: https://agripulse-web.onrender.com
#   API:      https://agripulse-api.onrender.com/docs
```

### After deploy

```bash
# Seed the database with Vidarbha data
# SSH into the backend service (Render dashboard → Shell)
python scripts/seed_data.py
```

---

## Option 2: Railway (Best DX)

**Why:** GitHub-integrated, auto-deploys on push, Postgres add-on, nice dashboard. $5 free credits/month.

### Steps

```bash
# 1. Install Railway CLI
npm install -g @railway/cli
railway login

# 2. Create project
railway init -n agripulse-intelligence

# 3. Add Postgres
railway add --plugin postgresql

# 4. Deploy backend
cd backend
railway up
# Set env vars in Railway dashboard:
#   DATABASE_URL (auto-set by plugin)
#   SECRET_KEY, NASA_POWER_BASE_URL, OPEN_METEO_BASE_URL

# 5. Deploy frontend
cd ../frontend
railway up
# Set NEXT_PUBLIC_API_BASE_URL to your backend URL

# 6. Or deploy the whole stack from Docker Compose
cd ..
railway up  # detects docker-compose.yml
```

### Alternative: GitHub integration

```bash
# Connect GitHub repo in Railway dashboard
# Railway auto-deploys on every push to main
# Set root directory to /backend for API service
# Set root directory to /frontend for web service
```

---

## Option 3: Vercel (Frontend) + Railway/Render (Backend)

**Why:** Best performance for Next.js. Vercel's edge network is unmatched. Split deploy — Vercel handles frontend, Railway handles API + DB.

### Steps

```bash
# 1. Deploy frontend to Vercel
cd frontend
npx vercel --prod
# Set environment variable:
#   NEXT_PUBLIC_API_BASE_URL=https://agripulse-api.onrender.com (or Railway URL)

# 2. Deploy backend to Railway or Render (see options above)

# 3. Update CORS in backend
# Add your Vercel URL to CORS_ORIGINS env var
```

---

## Option 4: Fly.io (Docker-native)

**Why:** Runs Docker containers globally. Good if you want to stay close to Docker Compose. Free tier: 3 shared VMs, 256MB each.

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh
fly auth login

# Deploy backend
cd backend
fly launch --name agripulse-api --region bom  # Mumbai region (closest to India)
fly postgres create --name agripulse-db --region bom
fly postgres attach agripulse-db

# Deploy frontend
cd ../frontend
fly launch --name agripulse-web --region bom
```

---

## Environment Variables (All Providers)

These need to be set regardless of provider:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | `postgresql://...` (auto-set by most providers) | ✅ |
| `SECRET_KEY` | Random 32-char string | ✅ |
| `ENVIRONMENT` | `production` | ✅ |
| `NASA_POWER_BASE_URL` | `https://power.larc.nasa.gov` | ✅ |
| `OPEN_METEO_BASE_URL` | `https://api.open-meteo.com` | ✅ |
| `CORS_ORIGINS` | Your frontend URL | ✅ |
| `NEXT_PUBLIC_API_BASE_URL` | Your backend URL | ✅ (frontend) |
| `REDIS_URL` | Redis connection string | Optional (caching) |

---

## Post-Deployment Checklist

- [ ] Both services are running (check `/health` on backend)
- [ ] Frontend can reach backend (open browser console, check API calls)
- [ ] Run seed script to populate Vidarbha districts + historical data
- [ ] Verify NASA POWER API returns live data: `GET /api/v1/weather/daily/yavatmal`
- [ ] Verify Open-Meteo forecast works: `GET /api/v1/weather/forecast/yavatmal`
- [ ] Test the dashboard loads with real charts
- [ ] Set up a custom domain (optional): `agripulse.in` or `agripulse.app`

---

## Cost Comparison (MVP stage)

| Provider | Free Tier | Paid (when scaling) | Best For |
|----------|-----------|---------------------|----------|
| **Render** | 2 services + Postgres free | $7/mo per service | Simplest setup |
| **Railway** | $5/mo credits | ~$10-20/mo | Best developer experience |
| **Vercel + Railway** | Vercel free + Railway $5 | ~$15-25/mo | Best frontend performance |
| **Fly.io** | 3 VMs free | ~$10-15/mo | Docker-native, Mumbai region |

**Recommendation for MVP pilot with 15 users in Vidarbha:** Start with **Render** (zero cost, zero config). Move to Railway or Vercel+Railway when you hit free tier limits or need faster cold starts.
