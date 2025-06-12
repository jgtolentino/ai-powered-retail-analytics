# Deploy to Vercel Production

## Quick Deploy Commands:

```bash
# 1. Build locally first to verify
npm run build

# 2. Deploy to production using Vercel CLI
vercel --prod

# OR use the npm script if available
npm run deploy

# OR trigger deployment via Vercel API (if token set)
curl -X POST "https://api.vercel.com/v1/integrations/deploy/ai-powered-retail-analytics" \
     -H "Authorization: Bearer $VERCEL_TOKEN" \
     -d '{"target":"production"}'
```

## If Vercel CLI not installed:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Auto-deploy via Git (Recommended):

```bash
# If main branch is connected to Vercel, just push:
git push origin main

# Vercel will automatically build and deploy
```

## Verify Production Deployment:

```bash
# Check if site is live (replace with your actual URL)
curl -sf https://ai-powered-retail-analytics.vercel.app/ | grep -q "Analytics" \
  && echo "✅ Production site is live" || echo "❌ Site not responding"

# Test specific page
curl -sf https://ai-powered-retail-analytics.vercel.app/overview \
  && echo "✅ Overview page works" || echo "❌ Overview page failed"
```

## Expected Production URL:
- https://ai-powered-retail-analytics.vercel.app/
- https://ai-powered-retail-analytics.vercel.app/overview
- https://ai-powered-retail-analytics.vercel.app/sales-explorer
- https://ai-powered-retail-analytics.vercel.app/basket-analysis
- https://ai-powered-retail-analytics.vercel.app/consumer-insights

## What Will Be Deployed:
✅ Simplified navigation (4 pages only)
✅ Unified sidebar with grouped sections
✅ Fluid typography and responsive design
✅ No more Device Health, Brand Performance, AI Console, System Logs
✅ Clean Analytics section only