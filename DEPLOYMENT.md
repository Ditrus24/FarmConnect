# Deployment Guide

## Vercel Deployment (Frontend Only)

The FarmConnect frontend is ready to deploy on Vercel. It uses localStorage for data storage, so no backend is required.

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from the project root
cd "c:\Users\dhruv\OneDrive\Desktop\Replit FarmFresh\Farm-Connect\Farm-Connect"
vercel
```

### Option 2: Deploy via GitHub Integration (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in with your GitHub account
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository:**
   - Select `Ditrus24/FarmConnect` from the list
   - If not visible, paste: `https://github.com/Ditrus24/FarmConnect`

4. **Configure Build Settings:**
   - **Framework**: Vite (should auto-detect)
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `artifacts/farmconnect/dist`
   - **Install Command**: `pnpm install`

5. **Environment Variables** (optional - not needed for frontend only):
   ```
   PORT=5173
   BASE_PATH=/
   ```

6. **Click "Deploy"** and wait for it to complete

### Option 3: Deploy Using Vercel Dashboard

1. Visit your Vercel dashboard: https://vercel.com/dashboard
2. Click **"Add New... → Project"**
3. Connect your GitHub account if haven't already
4. Select the FarmConnect repository
5. Vercel will automatically detect the configuration from `vercel.json`
6. Click **"Deploy"**

## What Happens on Deploy

✅ Vercel will:
- Install dependencies with `pnpm`
- Run `pnpm run build` (which includes typecheck)
- Build the Vite app
- Deploy to `https://your-project-name.vercel.app`
- Auto-deploy on every push to `main` branch

## Demo Features Available

After deployment, all these features work out of the box:

- ✅ Farmer signup/login: `raju@farm.com` / any password
- ✅ Consumer signup/login: `demo@consumer.com` / any password
- ✅ Browse products
- ✅ Add/edit/delete products (as farmer)
- ✅ Shopping cart
- ✅ Price suggestions
- ✅ Order management
- ✅ Dark/light theme

All data is stored in localStorage and persists between sessions.

## Custom Domain (Optional)

In your Vercel dashboard:
1. Go to your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build fails with "PORT environment variable required"
- ✅ Already fixed in vite.config.ts with defaults

### Build fails with missing dependencies
- Run locally: `pnpm install && pnpm run build`
- Check `pnpm-lock.yaml` is committed

### Styles not loading correctly
- Ensure `BASE_PATH=/` env var is set (default)
- Clear browser cache and hard refresh (Ctrl+Shift+R)

## Next Steps: Full Stack Deployment

When ready to add the backend API:

1. Deploy API to **Render** or **Railway**:
   - PostgreSQL database
   - Express API server
   - Set `DATABASE_URL` environment variable

2. Update frontend `.env` to point to API:
   ```
   VITE_API_BASE_URL=https://your-api.render.com
   ```

3. Re-deploy to Vercel

Need help with any of this? Let me know!
