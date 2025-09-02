# Jitsi Meet Integration Guide

## Overview
This healthcare teleconsultation platform integrates with Jitsi Meet to provide secure video/audio calling capabilities for appointments and custom meetings.

## Features Implemented

### 1. Automatic Meeting Link Generation
- **Appointments**: Virtual appointments automatically generate Jitsi meeting links
- **Custom Meetings**: Separate meeting system for doctor-hospital, hospital-admin, etc.
- **Secure JWT Tokens**: Each meeting gets a unique JWT for authentication
- **Room Management**: Unique room names prevent unauthorized access

### 2. API Endpoints

#### Appointments (Enhanced with Jitsi)
```
POST /api/appointments          # Creates appointment with auto Jitsi link
GET /api/appointments/:id       # Gets appointment with meeting link
GET /api/appointments/user/:userId  # Gets user appointments with links
```

#### Custom Meetings (New)
```
POST /api/meetings              # Create custom meeting
GET /api/meetings/:id           # Get meeting details
GET /api/meetings/user/:userId  # Get user meetings
DELETE /api/meetings/:id        # Cancel meeting
PATCH /api/meetings/:id/status  # Update meeting status
```

### 3. Database Models

#### Updated Appointment Model
```javascript
{
  // ... existing fields
  meetingLink: String,    // Full Jitsi URL with JWT
  roomName: String,       // Unique room identifier
}
```

#### New Meeting Model
```javascript
{
  createdBy: ObjectId,
  participants: [ObjectId],
  roleContext: String,    // 'patient-doctor', 'doctor-hospital', etc.
  title: String,
  jitsiLink: String,
  roomName: String,
  status: String,         // 'scheduled', 'active', 'completed', 'cancelled'
  meetingType: String,    // 'video', 'audio', 'chat'
  scheduledAt: Date,
  startedAt: Date,
  endedAt: Date,
  duration: Number        // in minutes
}
```

## Configuration

### 1. Environment Variables
Add these to your `.env` file:

```bash
# Jitsi Configuration
JITSI_APP_ID=your-jitsi-app-id
JITSI_SECRET=your-jitsi-secret-key
JITSI_DOMAIN=meet.jit.si

# For self-hosted Jitsi
# JITSI_DOMAIN=your-jitsi-domain.com
```

### 2. Jitsi Setup Options

#### Option A: Use Public Jitsi (meet.jit.si)
- Set `JITSI_DOMAIN=meet.jit.si`
- Generate your own `JITSI_APP_ID` and `JITSI_SECRET`
- No additional setup required

#### Option B: Self-Hosted Jitsi
- Install Jitsi Meet on your server
- Configure JWT authentication
- Update `JITSI_DOMAIN` to your server
- Configure app ID and secret in Jitsi config

## Usage Examples

### 1. Creating an Appointment with Auto Jitsi Link

```javascript
// POST /api/appointments
{
  "hospital": "hospital_id",
  "department": "Cardiology",
  "appointmentType": "virtual",  // Triggers Jitsi link generation
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:00 AM",
  "reasonForVisit": "Chest pain consultation",
  "patientDetails": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "age": 35,
    "gender": "Male"
  }
}

// Response includes:
{
  "status": "success",
  "data": {
    "appointment": {
      // ... appointment data
      "meetingLink": "https://meet.jit.si/appointment-66f123...?jwt=eyJ0eXAi...",
      "roomName": "appointment-66f123...-a1b2c3d4"
    }
  }
}
```

### 2. Creating Custom Meetings

```javascript
// POST /api/meetings
{
  "participants": ["doctor_id", "hospital_admin_id"],
  "roleContext": "doctor-hospital",
  "title": "Weekly Medical Review",
  "description": "Discuss patient cases and protocols",
  "scheduledAt": "2024-01-15T14:00:00Z",
  "meetingType": "video"
}

// Response includes:
{
  "status": "success",
  "data": {
    "meeting": {
      // ... meeting data
    },
    "jitsiDetails": {
      "meetingLink": "https://meet.jit.si/meeting-66f456...?jwt=eyJ0eXAi...",
      "roomName": "meeting-66f456...-x9y8z7w6",
      "domain": "meet.jit.si"
    }
  }
}
```

### 3. Role-Based Access Control

The system enforces authorization for:

- **Appointments**: Only patient, assigned doctor, hospital staff, or admin can view
- **Meetings**: Only participants or admin can view/join
- **Meeting Creation**: Role context validates who can create what type of meeting

### 4. Meeting Status Tracking

```javascript
// PATCH /api/meetings/:id/status
{
  "status": "active",  // 'scheduled', 'active', 'completed', 'cancelled'
  "notes": "Meeting started on time"
}

// System automatically tracks:
// - startedAt: when status changes to 'active'
// - endedAt: when status changes to 'completed'
// - duration: calculated automatically
```

## Security Features

1. **JWT Authentication**: Each meeting link includes a secure JWT token
2. **Unique Room Names**: Prevents unauthorized access to meetings
3. **Role-Based Access**: Users can only join meetings they're authorized for
4. **Time-Limited Tokens**: JWT tokens expire (default 24 hours)
5. **Participant Validation**: System verifies user authorization before generating links

## Frontend Integration

Your frontend can consume these APIs to:

1. **Display Meeting Links**: Show Jitsi links in appointment/meeting details
2. **Embed Jitsi**: Use the Jitsi Web SDK to embed meetings directly
3. **Meeting Controls**: Update meeting status, add notes, track duration
4. **Real-time Updates**: Use WebSocket or polling to sync meeting status

## Troubleshooting

### Common Issues

1. **Invalid JWT**: Check JITSI_SECRET and JITSI_APP_ID configuration
2. **Room Access Denied**: Verify user is in meeting participants
3. **Meeting Link Not Generated**: Check Jitsi service configuration
4. **CORS Issues**: Ensure your frontend domain is whitelisted

### Testing

Test your integration using:

```bash
# Create a test meeting
curl -X POST http://localhost:5000/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "participants": ["user_id_1", "user_id_2"],
    "title": "Test Meeting",
    "meetingType": "video"
  }'
```

## Next Steps

1. Configure your Jitsi environment variables
2. Test the API endpoints with your frontend
3. Implement real-time meeting status updates
4. Add meeting recording capabilities (if needed)
5. Set up monitoring for meeting quality metrics
