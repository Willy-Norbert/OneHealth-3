# API Configuration Test

## Current Configuration

### Backend URLs:
- **Production**: `http://localhost:5000` ✅ (Verified working)
- **Local**: `http://localhost:5000`

### Frontend API Configuration:
- **Production**: Automatically uses `http://localhost:5000`
- **Development**: Automatically uses `http://localhost:5000`
- **Override**: Set `NEXT_PUBLIC_API_URL` environment variable

## Test API Calls

### Production (Vercel):
```javascript
// These will call: http://localhost:5000/auth/login
api.login({ email: 'test@example.com', password: 'password' })
api.hospitals.list() // calls: http://localhost:5000/hospitals
```

### Development (Localhost):
```javascript
// These will call: http://localhost:5000/auth/login
api.login({ email: 'test@example.com', password: 'password' })
api.hospitals.list() // calls: http://localhost:5000/hospitals
```

## Verification Steps

1. **Check Backend is Running**:
   - Visit: http://localhost:5000
   - Should see: "API is running..."

2. **Test CORS**:
   - Open browser dev tools
   - Try to login from frontend
   - Should NOT see CORS errors

3. **Test Rate Limiting**:
   - Try multiple login attempts
   - Should allow up to 20 attempts per 15 minutes

4. **Test Missing Routes**:
   - Visit: http://localhost:5000/favicon.ico (should return 204)
   - Visit: http://localhost:5000/pharmacy (should redirect to /pharmacies)
