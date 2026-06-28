# Railway Deployment Quick Reference

## Connection Details
- **Database URL**: `postgresql://postgres:lSzpRjcUeEZlTifUjRNZTxMwVnfSWXBP@reseau.proxy.rlwy.net:10176/railway`
- **Status**: ✅ Configured in `.env.local`

## Files Created/Updated

### Configuration Files
- ✅ `.env.local` - Production environment with Railway database
- ✅ `docker-compose.railway.yml` - Optimized compose file for Railway
- ✅ `RAILWAY_SETUP.md` - Complete setup guide

### Environment Setup
The following variables are configured and need YOUR attention:

| Variable | Status | Action Required |
|----------|--------|-----------------|
| `DATABASE_URL` | ✅ Set | Connected to Railway ✅ |
| `REDIS_URL` | ⚠️ Local | Update to Railway Redis URL |
| `JWT_ACCESS_SECRET` | ❌ Placeholder | Generate new: `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | ❌ Placeholder | Generate new: `openssl rand -base64 32` |
| `NEXT_PUBLIC_API_URL` | ⚠️ Placeholder | Update to your API domain |
| `NEXT_PUBLIC_APP_URL` | ⚠️ Placeholder | Update to your app domain |
| `TRACKING_DOMAIN_HOST` | ⚠️ Placeholder | Update to your tracking domain |
| `TRACKING_DOMAIN_SCHEME` | ✅ Set | Already set to `https` |

## 🚀 Quick Start Commands

### 1. Prepare Environment
```bash
# Navigate to project
cd c:\Users\robiu\OneDrive\Desktop\Nextra.io\geotracker

# Edit .env.local with your values
notepad .env.local
```

### 2. Database Migrations
```bash
# Option A: Using Docker (Recommended)
docker-compose -f docker-compose.railway.yml --env-file .env.local run --rm api pnpm --filter @geotrackr/api prisma:deploy

# Option B: Local Node.js
cd apps/api
$env:DATABASE_URL="postgresql://postgres:lSzpRjcUeEZlTifUjRNZTxMwVnfSWXBP@reseau.proxy.rlwy.net:10176/railway"
pnpm prisma migrate deploy
```

### 3. Deploy with Docker
```bash
# Build images
docker-compose -f docker-compose.railway.yml build

# Start services
docker-compose -f docker-compose.railway.yml --env-file .env.local up -d

# Check status
docker-compose -f docker-compose.railway.yml ps

# View logs
docker-compose -f docker-compose.railway.yml logs -f api
```

### 4. Deploy to Railway (Git Push)
```bash
# Commit and push to Railway
git add .
git commit -m "Configure Railway PostgreSQL database"
git push railway main
```

## 📋 Pre-Deployment Checklist

Before going live:

- [ ] Edit `.env.local` with secure JWT secrets
- [ ] Update `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_APP_URL`
- [ ] Set up Redis on Railway (or use local Redis temporarily)
- [ ] Run database migrations successfully
- [ ] Test API health endpoint: `GET /health`
- [ ] Test Web app loads: `GET /`
- [ ] Verify HTTPS is configured
- [ ] Test user registration and login
- [ ] Review logs for any errors

## 🔐 Security Reminders

- ✅ `.env.local` is in `.gitignore`
- ✅ Database password is secure
- ❌ JWT secrets must be changed before production
- ❌ Never commit `.env.local` to Git
- ✅ Use HTTPS for all URLs in production

## 📊 Service Endpoints

Once deployed:
- **API**: `http://localhost:4000` (or your domain)
- **Web App**: `http://localhost:3000` (or your domain)
- **Health Check**: `http://localhost:4000/health`

## 🆘 Troubleshooting

### Connection Error to Railway
```
Error: connect ECONNREFUSED reseau.proxy.rlwy.net:10176
```
**Solution**: 
- Check Railway dashboard that PostgreSQL is running
- Verify network connectivity
- Ensure credentials are correct in `.env.local`

### Migrations Fail
```
Error: PrismaClientInitializationError
```
**Solution**:
- Verify `DATABASE_URL` in `.env.local`
- Run: `pnpm --filter @geotrackr/api prisma generate`
- Check migration files exist in `apps/api/prisma/migrations/`

### Docker Build Fails
**Solution**:
- Clear cache: `docker system prune -a`
- Rebuild: `docker-compose -f docker-compose.railway.yml build --no-cache`

## 📞 Next Steps

1. ✅ **Update `.env.local`** with your configuration
2. ✅ **Run migrations** to set up database schema
3. ✅ **Test locally** with `docker-compose.railway.yml`
4. ✅ **Deploy to Railway** via Git push or Railway CLI

---

**Setup Date**: 2026-06-28  
**Database**: Railway PostgreSQL ✅  
**Status**: Ready for Configuration & Testing
