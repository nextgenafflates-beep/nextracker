# Vercel + GitHub Deployment Guide

## Architecture

```
GitHub Repository (nextgenafflates-beep/nextra)
    ├── Vercel (Web - Next.js)
    └── Railway (API - NestJS)
```

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free)
- ✅ GitHub personal access token
- ✅ Repository created on GitHub
- ✅ `.env.local` configured with JWT secrets and URLs

## Step 1: Create GitHub Personal Access Token

### Generate Token

1. Go to https://github.com/settings/tokens/new
2. Click **Generate new token** → **Generate new token (classic)**
3. Fill in the form:
   - **Token name**: `vercel-deployment`
   - **Expiration**: 90 days (or custom)
   - **Scopes**: Select the following:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)

4. Click **Generate token**
5. **Copy and save** the token securely (you won't be able to see it again)

## Step 2: Push Code to GitHub

### Initialize Git Repository

```bash
cd c:\Users\robiu\OneDrive\Desktop\Nextra.io\geotracker

# Initialize git (if not already done)
git init

# Add remote repository
git remote add origin https://github.com/nextgenafflates-beep/nextra.git

# Create main branch and push
git branch -M main
git add .
git commit -m "Initial commit: GeoTrackr production setup"
git push -u origin main
```

### Important: `.env.local` Should NOT Be Committed

Verify `.env.local` is in `.gitignore`:

```bash
# Check if .env.local is ignored
git check-ignore -v .env.local

# Should output: .env.local (in .gitignore)
```

### What Gets Committed

- ✅ Source code (API & Web)
- ✅ Configuration files (vercel.json, docker-compose files, etc.)
- ✅ `.env.example` (safe - no secrets)
- ✅ Documentation (README, PRODUCTION.md, etc.)
- ❌ `.env.local` (secrets - ignored)
- ❌ `node_modules/` (ignored)
- ❌ `.next/` (ignored)
- ❌ `dist/` (ignored)

## Step 3: Deploy to Vercel

### Option A: Vercel CLI (Recommended for control)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel (opens browser)
vercel login

# Deploy from project root
vercel --prod
```

### Option B: Vercel Dashboard (Easier)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Search for repository: `nextra`
5. Select the repo and click **Import**
6. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`
   - **Output Directory**: `.next`
   - Click **Deploy**

### Option C: GitHub Integration (Auto-Deploy on Push)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Connect Git Repository"**
4. Authorize GitHub (if not already done)
5. Select `nextgenafflates-beep/nextra`
6. Configure as above
7. Click **Deploy**
8. Future commits to `main` auto-deploy!

## Step 4: Set Vercel Environment Variables

### In Vercel Dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_API_URL = https://nextra.vercel.app
NEXT_PUBLIC_APP_URL = https://geotrackr.vercel.app
```

3. Deploy again:
   - Go to **Deployments**
   - Click **...** on latest deployment
   - Select **Redeploy**

## Step 5: Update GitHub Repository Settings

### Branch Protection (Optional but Recommended)

1. Go to **Settings** → **Branches**
2. Add rule for `main`:
   - ✅ Require status checks before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require code reviews before merging

### Automatic Deployments

Once connected to Vercel:
- Every push to `main` auto-deploys to production
- Pull requests get preview deployments
- Merging PR to `main` deploys to production

## Step 6: Verify Deployment

### Check Vercel Deployment

```bash
# Your app should be live at:
# https://nextra.vercel.app (Web frontend)

# Check logs
vercel logs --prod
```

### Test API Connection

```bash
# Verify API is still running on Railway
curl https://nextra.vercel.app/api/health

# Should return:
# {"ok":true,"service":"api","ts":"2026-06-28T..."}
```

## Environment Variables Reference

### Vercel (Web App)
```
NEXT_PUBLIC_API_URL = https://nextra.vercel.app
NEXT_PUBLIC_APP_URL = https://geotrackr.vercel.app
```

### Railway (API Service)
```
DATABASE_URL = postgresql://postgres:***@reseau.proxy.rlwy.net:10176/railway
REDIS_URL = redis://default:***@reseau.proxy.rlwy.net:37166
JWT_ACCESS_SECRET = xdo8PXxYkcWHzfCeJDtnu65kzRXu6DkPOBwuPzHFqpw=
JWT_REFRESH_SECRET = wxV4b9IPjeSHDxY4BDnFxxuMYu9WPRfw5jlVPvD60dI=
NEXT_PUBLIC_API_URL = https://nextra.vercel.app
NEXT_PUBLIC_APP_URL = https://geotrackr.vercel.app
```

## Deployment Checklist

- [ ] GitHub account created
- [ ] Repository created: `nextgenafflates-beep/nextra`
- [ ] GitHub personal access token generated
- [ ] Code pushed to GitHub `main` branch
- [ ] `.env.local` NOT committed (in .gitignore)
- [ ] Vercel account created
- [ ] Project imported in Vercel
- [ ] Environment variables set in Vercel
- [ ] API deployment verified on Railway
- [ ] Web app deployed to Vercel
- [ ] Custom domain connected (optional)

## Troubleshooting

### Build Fails on Vercel

**Error**: `@geotrackr/api not found`

**Solution**: Update `vercel.json`:
```json
{
  "buildCommand": "cd apps/web && pnpm install && pnpm build",
  "outputDirectory": ".next"
}
```

### API Calls Fail

**Error**: CORS error or 404 when calling API

**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
2. Check API is running on Railway
3. Verify CORS is configured in `main.ts`
4. Check network connectivity in browser DevTools

### Environment Variables Not Loaded

**Solution**:
1. Redeploy from Vercel dashboard
2. Wait 5 minutes for cache to clear
3. Do hard refresh in browser (Ctrl+Shift+R)

## Useful Commands

```bash
# Deploy to Vercel
vercel --prod

# Check deployment logs
vercel logs --prod

# Pull Vercel environment variables
vercel env pull .env.production

# List all deployments
vercel list

# Check deployment status
vercel status
```

## CI/CD Pipeline

Every push to `main`:
1. GitHub Actions runs (lint, typecheck, build)
2. If tests pass, Vercel auto-deploys
3. Preview deployment created
4. Production deployment on merge to `main`

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Connect Vercel to GitHub
3. ✅ Set environment variables
4. ✅ Test deployment
5. ✅ Monitor for errors

---

**Deployment Strategy**: Vercel (Web) + Railway (API)  
**Repository**: https://github.com/nextgenafflates-beep/nextra  
**Status**: Ready for GitHub push
