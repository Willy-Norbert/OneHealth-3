# Hospital Management System Backend - ENHANCED

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas connection
- Add to package.json: `"build:dev": "vite build --mode development"`

### Installation
```bash
npm install
node seed.js  # Creates realistic test data
npm start     # Starts server on port 5000
```

## 🏥 Complete Hospital Management Features

### Hospital Role Capabilities
- ✅ View only their own patients
- ✅ Create and manage doctors for their departments  
- ✅ View and manage appointments
- ✅ Reassign appointments to different doctors
- ✅ Access dashboard statistics
- ✅ Patient information retrieval at booking

### Test Accounts
```
Admin: admin@onehealth.rw | Admin#123
Hospital: kgh-admin@onehealth.rw | Admin#123  
Doctor: doctor_generalmedicine1@onehealth.rw | Doctor#123
Patient: patient1@onehealth.rw | Patient#123
```

## 📊 API Endpoints Summary

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Hospital Management
- `GET /hospitals` - Get all hospitals
- `GET /hospitals/:id/doctors` - Get hospital doctors
- `POST /hospitals/:id/doctors` - Create doctor for hospital
- `GET /hospitals/:id/appointments` - Get hospital appointments

### Patient Management  
- `GET /patients` - Get patients (hospital-filtered)
- `POST /patients` - Create patient profile
- `GET /patients/:id` - Get patient details

### Appointment Management
- `POST /appointments` - Book appointment
- `GET /appointments/all` - Get all appointments (role-filtered)
- `PATCH /appointments/:id/reassign` - Reassign to different doctor
- `GET /appointments/hospital-stats` - Hospital dashboard stats

### Department & Doctor Management
- `GET /departments?hospital=:id` - Get hospital departments
- `GET /doctors/department/:id` - Get doctors by department

## 🔐 Role-Based Access Control

### Admin
- Full access to all data
- Can approve hospitals
- Can manage all users

### Hospital  
- Only access their own data
- Can create/manage their doctors
- Can view their patients and appointments
- Can reassign appointments

### Doctor
- Access their own appointments
- View assigned patients
- Update consultation records

### Patient
- Create/update own profile  
- Book appointments
- View own medical records

## 📋 Enhanced Features Added

1. **Dedicated Patient Model** - Complete medical profiles
2. **Hospital-Specific Filtering** - Role-based data access
3. **Appointment Reassignment** - Transfer between doctors
4. **Hospital Dashboard** - Statistics and management
5. **Complete Seed Data** - Realistic test scenarios
6. **Enhanced Security** - Proper authorization checks

## 🛠 Frontend Integration

See `FRONTEND_INTEGRATION_GUIDE.md` for complete integration examples including:
- Authentication flow
- Hospital management UI
- Patient booking wizard
- Real-time updates
- Error handling

## 🏗 Architecture

The system uses:
- **Node.js + Express** - Backend API
- **MongoDB + Mongoose** - Database
- **JWT Authentication** - Secure access
- **Role-based Authorization** - Data access control
- **Comprehensive Logging** - Debug support

## 📞 Support

All hospital management features are now fully implemented with proper access control and comprehensive testing data. The system supports complete end-to-end hospital workflows.