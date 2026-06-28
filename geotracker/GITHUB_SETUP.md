# GitHub Setup Quick Start

## 1️⃣ Create GitHub Repository

### Step 1: Create on GitHub.com
1. Go to https://github.com/new
2. **Repository name**: `nextra`
3. **Owner**: `nextgenafflates-beep`
4. **Description**: "GeoTrackr - URL shortener with geo-targeting and analytics"
5. **Private/Public**: Choose based on preference
6. **Initialize**: Leave unchecked (we'll push existing code)
7. Click **Create repository**

### Step 2: Push Code from Local

```bash
# Navigate to project
cd c:\Users\robiu\OneDrive\Desktop\Nextra.io\geotracker

# Initialize git (if not already done)
git init

# Add GitHub remote
git remote add origin https://github.com/nextgenafflates-beep/nextra.git

# Create main branch
git branch -M main

# Verify .env.local is ignored
cat .gitignore | findstr ".env"

# Stage all files
git add .

# Commit
git commit -m "Initial commit: GeoTrackr production setup with Railway DB and Vercel config"

# Push to GitHub
git push -u origin main
```

## 2️⃣ Verify What Gets Committed

### Should Be Included ✅
```
✅ apps/api/              (NestJS source)
✅ apps/web/              (Next.js source)
✅ .github/               (CI/CD workflows)
✅ vercel.json            (Vercel config)
✅ docker-compose.*.yml   (Docker configs)
✅ .env.example           (No secrets)
✅ .env.production.example (Documentation)
✅ *.md                   (Documentation)
✅ prisma/                (Database schema)
✅ tsconfig.json          (TypeScript config)
```

### Should Be Ignored ❌
```
❌ .env.local             (Your secrets!)
❌ .env                   (Local environment)
❌ node_modules/          (Dependencies)
❌ .next/                 (Build output)
❌ dist/                  (Build output)
❌ .DS_Store              (macOS files)
```

## 3️⃣ Create GitHub Personal Access Token

### Generate Token
1. Go to https://github.com/settings/tokens/new
2. Click **Generate new token (classic)**
3. Name: `vercel-deployment`
4. Expiration: 90 days
5. Scopes:
   - ✅ `repo` (Full control)
   - ✅ `workflow` (GitHub Actions)
6. **Generate token**
7. **COPY THE TOKEN** (you won't see it again!)
8. **Save securely** (password manager, etc.)

### Use Token with Vercel
- You'll paste this token in Vercel when connecting to GitHub

## 4️⃣ Verify Repository

After pushing:

```bash
# Check remote
git remote -v

# Should show:
# origin  https://github.com/nextgenafflates-beep/nextra.git (fetch)
# origin  https://github.com/nextgenafflates-beep/nextra.git (push)

# Check branch
git branch

# Should show:
# * main

# Check commit history
git log --oneline

# Should show your commits
```

## 5️⃣ Connect to Vercel

### Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Click **GitHub** (or **"Connect GitHub Account"**)
5. Authorize Vercel to access GitHub
6. Search for **`nextra`**
7. Select **`nextgenafflates-beep/nextra`**
8. Click **Import**

### Configure Vercel Project

1. **Framework Preset**: Next.js ✅ (auto-detected)
2. **Root Directory**: `./apps/web`
3. **Build Command**: `pnpm install && pnpm build`
4. **Install Command**: `pnpm install`
5. **Output Directory**: `.next`
6. Leave other settings as default
7. Click **Deploy**

### Set Environment Variables in Vercel

After project is created:

1. Go to **Settings** → **Environment Variables**
2. Add variables:

```
Name: NEXT_PUBLIC_API_URL
Value: https://nextra.vercel.app
Environments: Production, Preview, Development

Name: NEXT_PUBLIC_APP_URL
Value: https://geotrackr.vercel.app
Environments: Production, Preview, Development
```

3. Click **Save**
4. Go to **Deployments**
5. Click **Redeploy** on latest deployment

## 📊 Deployment Status

After setup, you should have:

| Service | Status | URL |
|---------|--------|-----|
| GitHub Repo | ✅ Created | https://github.com/nextgenafflates-beep/nextra |
| Vercel Web | ✅ Deployed | https://nextra.vercel.app |
| Railway API | ✅ Configured | Internal: Railway Dashboard |
| CI/CD | ✅ Active | GitHub Actions on push |
| Auto-Deploy | ✅ Active | On push to `main` |

## 🔄 Workflow After Setup

### Making Changes Locally

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes...

# Commit and push
git add .
git commit -m "Add new feature"
git push -u origin feature/new-feature

# Create Pull Request on GitHub
# Review and merge to main
# Vercel auto-deploys! 🚀
```

## 🆘 Common Issues

### Push Rejected
```
Error: Permission denied
```
**Solution**: 
1. Create SSH key: `ssh-keygen -t ed25519`
2. Add to GitHub: Settings → SSH Keys
3. Update remote: `git remote set-url origin git@github.com:nextgenafflates-beep/nextra.git`

### .env.local Gets Committed
```
Error: .env.local appears in history
```
**Solution**:
```bash
# Remove from history
git rm --cached .env.local

# Commit removal
git commit -m "Remove .env.local from tracking"

# Push
git push
```

### Vercel Build Fails
Check: https://vercel.com/docs/concepts/deployments/troubleshoot

---

**Repository**: https://github.com/nextgenafflates-beep/nextra  
**Web Deployment**: Vercel  
**API Deployment**: Railway  
**Status**: Ready to Deploy ✅
