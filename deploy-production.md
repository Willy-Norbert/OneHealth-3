# Production Deployment Guide

## Frontend (Vercel)

### 1. Environment Variables in Vercel Dashboard
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_WS_URL=https://your-backend.onrender.com
NEXT_PUBLIC_TURN_USER=your_turn_username
NEXT_PUBLIC_TURN_CRED=your_turn_credential
```

### 2. Vercel Configuration
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3. Domain Configuration
- Add your custom domain in Vercel dashboard
- Update CORS origins in backend

## Backend (Render)

### 1. Environment Variables in Render Dashboard
```bash
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGIN=https://your-frontend.vercel.app
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

### 2. Render Configuration
- Runtime: Node
- Build Command: `npm install`
- Start Command: `node server.js`
- Health Check Path: `/test`

### 3. WebSocket Support
- Ensure Render supports WebSockets (it does by default)
- No additional configuration needed

## Testing Checklist

### 1. Frontend Tests
- [ ] Meeting page loads: `https://your-frontend.vercel.app/meeting/test-id`
- [ ] API calls work (check Network tab)
- [ ] WebSocket connection established (check Console)
- [ ] Video/audio permissions granted
- [ ] WebRTC connection works

### 2. Backend Tests
- [ ] Health check: `https://your-backend.onrender.com/test`
- [ ] API endpoints respond: `https://your-backend.onrender.com/meetings`
- [ ] CORS headers present
- [ ] WebSocket server running

### 3. Integration Tests
- [ ] Create meeting from frontend
- [ ] Join meeting with different users
- [ ] Video/audio streaming works
- [ ] Screen sharing works
- [ ] Prescription creation works

## Troubleshooting

### Common Issues

1. **"Not Found" Error**
   - Check if meeting ID exists in database
   - Verify API endpoint is accessible
   - Check CORS configuration

2. **WebSocket Connection Failed**
   - Verify WS_URL environment variable
   - Check if backend supports WebSockets
   - Try different transport methods

3. **Video/Audio Not Working**
   - Check browser permissions
   - Verify HTTPS is enabled
   - Check TURN server configuration

4. **CORS Errors**
   - Update allowedOrigins in server.js
   - Verify FRONTEND_URL environment variable
   - Check preflight requests

### Debug Commands

```bash
# Test API connectivity
curl -X GET https://your-backend.onrender.com/test

# Test meeting endpoint
curl -X GET https://your-backend.onrender.com/meetings/test-id \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check WebSocket connection
# Use browser dev tools Network tab
```

## Performance Optimization

### 1. Frontend
- Enable compression in Vercel
- Use CDN for static assets
- Optimize images
- Implement lazy loading

### 2. Backend
- Enable gzip compression
- Use Redis for session storage
- Implement rate limiting
- Monitor memory usage

### 3. WebRTC
- Use TURN servers for NAT traversal
- Implement connection quality monitoring
- Add reconnection logic
- Optimize video quality settings

