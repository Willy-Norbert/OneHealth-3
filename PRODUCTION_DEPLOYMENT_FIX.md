# Production Deployment Fix Guide

## Issues Fixed

### 1. CORS Configuration
- ✅ Fixed CORS allowed origins to include `https://onehealthlineconnectsss.vercel.app`
- ✅ Removed extra spaces from domain names
- ✅ Cleaned up duplicate entries

### 2. Rate Limiting
- ✅ Increased auth rate limit from 5 to 20 requests per 15 minutes in production
- ✅ Kept localhost unlimited (1000 requests) for development

### 3. Missing Routes
- ✅ Added `/favicon.ico` route (returns 204 No Content)
- ✅ Added `/pharmacy` route (redirects to `/pharmacies`)

### 4. Environment Variables

#### For Vercel Deployment (Frontend)
Set these environment variables in your Vercel dashboard:

```bash
NEXT_PUBLIC_API_URL=https://onehealthconnekt.onrender.com
BACKEND_URL=https://onehealthconnekt.onrender.com
```

**OR** leave them empty to use the automatic detection:
- Production: `https://onehealthconnekt.onrender.com`
- Development: `https://onehealthconnekt.onrender.com`

#### For Render Deployment (Backend)
Set these environment variables in your Render dashboard:

```bash
NODE_ENV=production
FRONTEND_URL=https://onehealthlineconnectsss.vercel.app
CORS_ORIGIN=https://onehealthlineconnectsss.vercel.app
AUTH_RATE_LIMIT_MAX=20
```

## How the Fix Works

1. **CORS**: The backend now properly allows requests from your Vercel domain
2. **Rate Limiting**: More reasonable limits that won't block legitimate users
3. **Direct API Calls**: Frontend calls backend directly (no proxy needed)
   - Production: `https://onehealthconnekt.onrender.com/auth/login`
   - Development: `https://onehealthconnekt.onrender.com/auth/login`
4. **Missing Routes**: Added fallback routes for common 404 errors

## Testing

### Local Development
- Frontend: `http://localhost:3000`
- Backend: `https://onehealthconnekt.onrender.com`
- API calls go directly to backend (`https://onehealthconnekt.onrender.com/auth/login`)

### Production
- Frontend: `https://onehealthlineconnectsss.vercel.app`
- Backend: `https://onehealthconnekt.onrender.com`
- API calls go directly to backend (`https://onehealthconnekt.onrender.com/auth/login`)

## Deployment Steps

1. **Deploy Backend to Render**:
   - Push changes to your repository
   - Render will automatically redeploy
   - Set environment variables in Render dashboard

2. **Deploy Frontend to Vercel**:
   - Push changes to your repository
   - Vercel will automatically redeploy
   - Set environment variables in Vercel dashboard

3. **Verify**:
   - Check that CORS errors are gone
   - Test login functionality
   - Verify no 404 errors for favicon/pharmacy

## Troubleshooting

If you still see CORS errors:
1. Check that environment variables are set correctly
2. Verify the domain is exactly `https://onehealthlineconnectsss.vercel.app` (no trailing slash)
3. Clear browser cache and try again

If rate limiting is still too strict:
1. Increase `AUTH_RATE_LIMIT_MAX` in Render environment variables
2. Redeploy the backend
