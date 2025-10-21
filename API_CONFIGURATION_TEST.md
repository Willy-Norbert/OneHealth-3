# API Configuration Test

## Current Configuration

### Backend URLs:
- **Production**: `http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io` ✅ (Verified working)
- **Local**: `http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io`

### Frontend API Configuration:
- **Production**: Automatically uses `http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io`
- **Development**: Automatically uses `http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io`
- **Override**: Set `NEXT_PUBLIC_API_URL` environment variable

## Test API Calls

### Production (Vercel):
```javascript
// These will call: http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io/auth/login
api.login({ email: 'test@example.com', password: 'password' })
api.hospitals.list() // calls: http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io/hospitals
```

### Development (Localhost):
```javascript
// These will call: http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io/auth/login
api.login({ email: 'test@example.com', password: 'password' })
api.hospitals.list() // calls: http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io/hospitals
```

## Verification Steps

1. **Check Backend is Running**:
   - Visit: http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io
   - Should see: "API is running..."

2. **Test CORS**:
   - Open browser dev tools
   - Try to login from frontend
   - Should NOT see CORS errors

3. **Test Rate Limiting**:
   - Try multiple login attempts
   - Should allow up to 20 attempts per 15 minutes

4. **Test Missing Routes**:
   - Visit: http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io/favicon.ico (should return 204)
   - Visit: http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io/pharmacy (should redirect to /pharmacies)
