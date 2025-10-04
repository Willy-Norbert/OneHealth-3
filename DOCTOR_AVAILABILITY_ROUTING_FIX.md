# Doctor Availability Routing Fix

## Problem
The doctor availability feature was failing with the error:
```
"Cast to ObjectId failed for value \"availability\" (type string) at path \"_id\" for model \"Doctor\""
```

## Root Cause
The issue was in the route order in `routes/doctorRoutes.js`. The generic route `/:id` was defined before the specific route `/availability`, causing Express to match `/doctors/availability` against `/:id` and treat "availability" as an ID parameter.

## Solution
Moved the specific routes before the generic `/:id` route in `routes/doctorRoutes.js`:

**Before:**
```javascript
router.get('/', getAllDoctors);
router.get('/:id', getDoctor);  // This was catching /availability

// Doctor self-settings and self-availability
router.get('/settings', protect, restrictTo('doctor'), getMySettings);
router.get('/availability', protect, restrictTo('doctor'), getMyAvailability);
```

**After:**
```javascript
router.get('/', getAllDoctors);

// Doctor self-settings and self-availability (MUST come before generic /:id route)
router.get('/settings', protect, restrictTo('doctor'), getMySettings);
router.get('/availability', protect, restrictTo('doctor'), getMyAvailability);

// Generic routes (must come after specific routes)
router.get('/:id', getDoctor);
```

## Additional Fixes
1. **Frontend API calls**: Updated `ScheduleEditor.tsx` and `doctor/settings/page.tsx` to use `apiFetch` instead of direct fetch calls for consistent authentication handling.

2. **Authentication**: The `apiFetch` utility properly handles JWT tokens from cookies, ensuring authentication headers are sent with all requests.

## Testing
- Backend server restarted to apply route changes
- Tested `/doctors/availability` endpoint - now correctly reaches authentication middleware instead of trying to parse "availability" as ObjectId
- Frontend should now be able to load doctor availability settings without the ObjectId casting error

## Expected Result
Doctors should now be able to:
1. View their current availability settings
2. Update their availability settings
3. See proper error messages if authentication fails
4. Have hospital admins manage their availability (when implemented)

The "Error retrieving doctor" message should be replaced with proper availability data or appropriate authentication errors.
