# Railway Database Setup Guide

## ✅ Configuration Complete

Your `.env.local` has been updated with the Railway PostgreSQL connection:
- **Host**: reseau.proxy.rlwy.net
- **Port**: 10176
- **Database**: railway
- **Status**: ✅ Ready for migrations

## 📋 Next Steps

### 1. Update Missing Configuration

Before deployment, update the following in `.env.local`:

```bash
# Generate new JWT secrets
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Set your domain URLs
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Set tracking domain
TRACKING_DOMAIN_HOST=your-tracking-domain.com
TRACKING_DOMAIN_SCHEME=https
```

### 2. Set Up Redis on Railway (Optional)

If you want to use Railway Redis as well:
1. Create a new Redis service in your Railway project
2. Copy the connection URL
3. Update `REDIS_URL` in `.env.local`

### 3. Run Database Migrations

Option A: **Using Docker Compose** (Recommended for production)
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.local run -rm api pnpm --filter @geotrackr/api prisma:deploy
```

Option B: **Local development** (if you have Node.js installed)
```bash
# Set environment variable
$env:DATABASE_URL="postgresql://postgres:lSzpRjcUeEZlTifUjRNZTxMwVnfSWXBP@reseau.proxy.rlwy.net:10176/railway"

# Navigate to API directory
cd apps/api

# Run migrations
pnpm prisma migrate deploy

# Or generate Prisma client
pnpm prisma generate
```

### 4. Verify Database Connection

Test connectivity by running:
```bash
# Using Docker (ensures you have all dependencies)
docker-compose -f docker-compose.prod.yml --env-file .env.local run --rm api bash -c "pnpm --filter @geotrackr/api exec prisma db execute --stdin <<< 'SELECT NOW();'"
```

### 5. Deploy with Docker Compose

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start all services
docker-compose -f docker-compose.prod.yml --env-file .env.local up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f api

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## 📊 Railway Services Setup

### Database
- **Type**: PostgreSQL
- **Version**: Latest
- **Connection**: Public domain (reseau.proxy.rlwy.net)
- **Status**: Connected ✅

### Redis (Optional)
- Create a new Redis service in Railway
- Link it to your application
- Update `REDIS_URL` in `.env.local`

### API & Web Services
1. Push the code to your Railway project
2. Set environment variables from `.env.local` in Railway dashboard
3. Services will auto-deploy on git push

## 🔒 Security Checklist

- [ ] All JWT secrets are strong random values
- [ ] Database password is secure
- [ ] Redis password is set (if using Railway Redis)
- [ ] HTTPS URLs are used in production
- [ ] `.env.local` is in `.gitignore` (should already be)
- [ ] No `.env.local` is committed to Git

## 🚀 Troubleshooting

### Connection refused
- Check that Railway PostgreSQL is running
- Verify IP whitelist settings in Railway dashboard
- Ensure network connectivity to reseau.proxy.rlwy.net

### Migrations fail
- Verify `DATABASE_URL` is correct
- Check that Prisma client is generated: `pnpm --filter @geotrackr/api prisma generate`
- Review migration files in `apps/api/prisma/migrations/`

### Docker issues
- Ensure Docker is running
- Clear unused containers: `docker system prune`
- Rebuild images: `docker-compose -f docker-compose.prod.yml build --no-cache`

## 📚 Useful Commands

```bash
# Check current database state
pnpm --filter @geotrackr/api exec prisma studio

# Reset database (WARNING: Deletes all data)
pnpm --filter @geotrackr/api exec prisma migrate reset

# View migration status
pnpm --filter @geotrackr/api exec prisma migrate status

# Create new migration (after schema changes)
pnpm --filter @geotrackr/api exec prisma migrate dev --name migration_name
```

## 📞 Support

- **Railway Docs**: https://docs.railway.app/
- **Prisma Docs**: https://www.prisma.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---
**Setup Date**: 2026-06-28
**Database**: Railway PostgreSQL ✅
