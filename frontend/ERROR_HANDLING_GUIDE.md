# Error Handling System Guide

This guide explains the comprehensive error handling system implemented in the OneHealth application.

## Overview

The error handling system provides user-friendly error pages for various scenarios:
- **404 Not Found**: When a page doesn't exist
- **Offline**: When there's no internet connection
- **Server Error (500)**: When backend services are down
- **Access Denied (403)**: When user lacks permissions
- **Application Error**: For client-side errors
- **Global Error**: For critical system errors

## Error Pages

### 1. 404 Not Found (`/not-found`)
- **File**: `frontend/src/app/not-found.tsx`
- **Triggered**: When navigating to non-existent routes
- **Features**: 
  - Beautiful night sky design with mountains
  - Search functionality
  - Navigation options (Go Back, Go Home, Refresh)

### 2. Offline Page (`/offline`)
- **File**: `frontend/src/app/offline/page.tsx`
- **Triggered**: When network connectivity is lost
- **Features**:
  - Real-time network status detection
  - Automatic redirect when connection is restored
  - Retry functionality with attempt counter

### 3. Server Error Page (`/server-error`)
- **File**: `frontend/src/app/server-error/page.tsx`
- **Triggered**: For 500, 502, 503, 504 HTTP errors
- **Features**:
  - Dynamic error messages based on retry attempts
  - Helpful suggestions for users
  - Retry functionality with loading states

### 4. Access Denied Page (`/access-denied`)
- **File**: `frontend/src/app/access-denied/page.tsx`
- **Triggered**: For 403 HTTP errors
- **Features**:
  - Clear permission messaging
  - Guidance for resolving access issues

### 5. Application Error (`/error`)
- **File**: `frontend/src/app/error.tsx`
- **Triggered**: For client-side React errors
- **Features**:
  - Error boundary integration
  - Error ID tracking for debugging

### 6. Global Error (`/global-error`)
- **File**: `frontend/src/app/global-error.tsx`
- **Triggered**: For critical system errors
- **Features**:
  - Complete page replacement
  - Critical error messaging

## Network Detection

### Network Status Hook
- **File**: `frontend/src/hooks/useNetworkStatus.ts`
- **Features**:
  - Real-time online/offline detection
  - Connection speed monitoring
  - Connection type detection

### Network Context
- **File**: `frontend/src/context/NetworkContext.tsx`
- **Features**:
  - Global network state management
  - Automatic offline page routing
  - Connection restoration handling

### Network Status Component
- **File**: `frontend/src/components/NetworkStatus.tsx`
- **Features**:
  - Top banner notifications
  - Connection status indicators
  - Auto-hide functionality

## Error Handling Utilities

### Error Handler Class
- **File**: `frontend/src/utils/errorHandler.ts`
- **Features**:
  - Centralized error processing
  - Automatic error page routing
  - Retry logic for recoverable errors
  - User-friendly error messages

### Usage Example
```typescript
import { useErrorHandler } from '@/utils/errorHandler'

function MyComponent() {
  const errorHandler = useErrorHandler()
  
  const handleApiCall = async () => {
    try {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('API Error')
    } catch (error) {
      errorHandler.handleError(error)
    }
  }
}
```

## Integration

### Provider Setup
The error handling system is integrated through the main providers:

```typescript
// frontend/src/app/providers.tsx
<NetworkProvider>
  <AuthProvider>
    <NotificationsProvider>
      {children}
    </NotificationsProvider>
  </AuthProvider>
</NetworkProvider>
```

### Automatic Error Routing
The system automatically routes users to appropriate error pages based on:
- HTTP status codes
- Network connectivity
- Application errors
- User permissions

## Design Features

All error pages feature:
- **Consistent Design**: Mountain/night sky theme with gradients
- **Responsive Layout**: Works on all device sizes
- **Accessibility**: Proper contrast and keyboard navigation
- **Interactive Elements**: Hover effects and smooth transitions
- **User Guidance**: Clear instructions and helpful suggestions

## Customization

### Adding New Error Types
1. Create a new error page in `frontend/src/app/[error-type]/page.tsx`
2. Add routing logic in `frontend/src/utils/errorHandler.ts`
3. Update the error handler switch statement

### Modifying Error Messages
Edit the `getErrorMessage` function in `frontend/src/utils/errorHandler.ts` to customize error messages.

### Styling Changes
All error pages use Tailwind CSS classes and can be customized by modifying the component files.

## Testing

### Manual Testing
1. **404**: Navigate to a non-existent route
2. **Offline**: Disable network in browser dev tools
3. **Server Error**: Trigger a 500 error from backend
4. **Access Denied**: Access a protected route without permissions

### Network Testing
- Use browser dev tools to simulate offline conditions
- Test connection speed detection
- Verify automatic reconnection handling

## Best Practices

1. **Always handle errors gracefully** - Never show raw error messages to users
2. **Provide clear next steps** - Tell users what they can do to resolve issues
3. **Use consistent styling** - Maintain the design system across all error pages
4. **Log errors properly** - Use console.error for debugging while showing user-friendly messages
5. **Test offline scenarios** - Ensure the app works well without internet

## Troubleshooting

### Common Issues
1. **Error pages not showing**: Check that files are in the correct `app` directory structure
2. **Network detection not working**: Ensure the NetworkProvider is properly wrapped around the app
3. **Styling issues**: Verify Tailwind CSS is properly configured

### Debug Mode
Enable debug logging by adding console.log statements in the error handler utilities.

## Future Enhancements

Potential improvements:
- Error reporting to external services (Sentry, LogRocket)
- Offline data caching
- Progressive Web App (PWA) features
- Error analytics and monitoring
- A/B testing for error page designs
