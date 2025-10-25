# API Configuration Test

## Current Configuration

### Backend URLs:
- **Production**: `https://api.onehealthline.com` ✅ (Verified working)
- **Local**: `https://api.onehealthline.com`

### Frontend API Configuration:
- **Production**: Automatically uses `https://api.onehealthline.com`
- **Development**: Automatically uses `https://api.onehealthline.com`
- **Override**: Set `NEXT_PUBLIC_API_URL` environment variable

## Test API Calls

### Production (Vercel):
```javascript
// These will call: https://api.onehealthline.com/auth/login
api.login({ email: 'test@example.com', password: 'password' })
api.hospitals.list() // calls: https://api.onehealthline.com/hospitals
```

### Development (Localhost):
```javascript
// These will call: https://api.onehealthline.com/auth/login
api.login({ email: 'test@example.com', password: 'password' })
api.hospitals.list() // calls: https://api.onehealthline.com/hospitals
```

## Verification Steps

1. **Check Backend is Running**:
   - Visit: https://api.onehealthline.com
   - Should see: "API is running..."

2. **Test CORS**:
   - Open browser dev tools
   - Try to login from frontend
   - Should NOT see CORS errors

3. **Test Rate Limiting**:
   - Try multiple login attempts
   - Should allow up to 20 attempts per 15 minutes

4. **Test Missing Routes**:
   - Visit: https://api.onehealthline.com/favicon.ico (should return 204)
   - Visit: https://api.onehealthline.com/pharmacy (should redirect to /pharmacies)
