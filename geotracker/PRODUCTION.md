# GeoTrackr - Production Deployment Guide

## Prerequisites
- Docker & Docker Compose (or similar container orchestration)
- PostgreSQL 16+
- Redis 7+
- Node.js 22+ (if running without Docker)

## Security Checklist

Before deploying to production:

- [ ] Generate strong JWT secrets using: `openssl rand -base64 32`
- [ ] Update all `JWT_*` variables in `.env.local`
- [ ] Change default database credentials
- [ ] Set secure Redis password
- [ ] Update `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Enable HTTPS for all URLs (use `https://` scheme)
- [ ] Configure CORS properly in the API (update main.ts)
- [ ] Use environment variables, not hardcoded values
- [ ] Do NOT commit `.env` or `.env.local` files
- [ ] Use managed database and cache services (RDS, ElastiCache, etc.)
- [ ] Set up SSL/TLS certificates
- [ ] Enable database backups
- [ ] Configure Redis persistence and backups
- [ ] Set up monitoring and alerting
- [ ] Use strong TRACKING_DOMAIN_SCHEME (https)

## Environment Setup

1. Copy the production environment template:
```bash
cp .env.production.example .env.local
```

2. Edit `.env.local` with your production values:
```bash
# Generate secure secrets
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
```

3. For Docker Compose, create a `.env` file or pass variables:
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.local up -d
```

## Running with Docker Compose

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f api

# Stop services
docker-compose -f docker-compose.prod.yml down

# Database migration
docker-compose -f docker-compose.prod.yml exec api pnpm --filter @geotrackr/api prisma:deploy
```

## Scaling Considerations

### Running Worker Separately
For better scalability, run the click processor worker separately:

```bash
docker-compose -f docker-compose.prod.yml up -d --scale worker=2
```

Use the `Dockerfile.worker` for dedicated worker instances.

### Database Optimization
- Enable query logging in PostgreSQL
- Set up appropriate indexes (already configured in schema)
- Use connection pooling (PgBouncer or similar)
- Regular vacuum and analyze

### Caching Strategy
- Redis should have persistence enabled (`--appendonly yes`)
- Monitor Redis memory usage
- Configure appropriate eviction policies

## Monitoring & Logs

- Monitor API health: `GET /health`
- Monitor Web health: `GET /` (should return 200)
- Set up centralized logging (ELK, CloudWatch, etc.)
- Monitor database connections and query performance
- Monitor Redis memory and hit rate

## Backup Strategy

- PostgreSQL: Configure automated daily backups
- Redis: Use RDB snapshots (`appendonly yes`)
- Application code: Use version control (Git)

## Performance Optimization

### API Optimization
- Enable response caching where appropriate
- Optimize database queries
- Use database indexes (already configured)
- Enable gzip compression in reverse proxy

### Frontend Optimization
- Next.js automatic optimizations enabled
- Enable static generation where possible
- Use CDN for static assets
- Monitor Core Web Vitals

## Troubleshooting

### Database Connection Issues
```bash
# Check connection
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# View logs
docker-compose -f docker-compose.prod.yml logs postgres
```

### Redis Connection Issues
```bash
# Check connection
docker-compose -f docker-compose.prod.yml exec redis redis-cli ping

# View logs
docker-compose -f docker-compose.prod.yml logs redis
```

### API Issues
```bash
# View detailed logs
docker-compose -f docker-compose.prod.yml logs -f api

# Check environment variables
docker-compose -f docker-compose.prod.yml exec api env | grep -E '^(NODE_ENV|DATABASE_URL|REDIS_URL)'
```

## Maintenance Tasks

### Regular Maintenance
- Monitor disk space
- Update Docker images regularly
- Review access logs
- Audit user accounts and permissions

### Database Maintenance
```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec api pnpm --filter @geotrackr/api prisma:deploy

# Analyze database
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d geotrackr -c "ANALYZE;"
```

## Support

For issues, check:
1. Application logs: `docker-compose logs -f`
2. Database connectivity
3. Redis connectivity
4. Environment variables in `.env.local`
5. SSL/TLS certificate validity
