# Frontend Integration Guide - Hospital Management System

## 🚀 Quick Start

### Base Configuration
```javascript
const API_BASE_URL = ' https://api.onehealthline.com';
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});
```

## 🔐 Authentication Flow

### 1. Login
```javascript
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.status === 'success') {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};
```

### 2. Test Accounts
```
Admin: admin@onehealth.rw | Password: Admin#123
Hospital: kgh-admin@onehealth.rw | Password: Admin#123
Doctor: Any doctor_* email | Password: Doctor#123
Patient: patient1@onehealth.rw | Password: Patient#123
```

## 🏥 Hospital Management (Hospital Role)

### Get Hospital's Patients
```javascript
const getHospitalPatients = async (page = 1) => {
  const response = await fetch(
    `${API_BASE_URL}/patients?page=${page}&limit=10`,
    { headers: getAuthHeaders() }
  );
  return response.json();
};
```

### Get Hospital's Doctors
```javascript
const getHospitalDoctors = async (hospitalId, page = 1) => {
  const response = await fetch(
    `${API_BASE_URL}/hospitals/${hospitalId}/doctors?page=${page}`,
    { headers: getAuthHeaders() }
  );
  return response.json();
};
```

### Create Doctor for Hospital
```javascript
const createDoctor = async (hospitalId, doctorData) => {
  const response = await fetch(
    `${API_BASE_URL}/hospitals/${hospitalId}/doctors`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        licenseNumber: doctorData.licenseNumber,
        specialization: doctorData.specialization,
        department: doctorData.departmentId,
        consultationFee: doctorData.fee,
        // Create new user for doctor
        doctorInfo: {
          name: doctorData.name,
          email: doctorData.email,
          password: doctorData.password
        }
      })
    }
  );
  return response.json();
};
```

### Get Hospital Appointments
```javascript
const getHospitalAppointments = async (hospitalId, filters = {}) => {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...(filters.status && { status: filters.status }),
    ...(filters.date && { date: filters.date })
  });
  
  const response = await fetch(
    `${API_BASE_URL}/hospitals/${hospitalId}/appointments?${params}`,
    { headers: getAuthHeaders() }
  );
  return response.json();
};
```

### Reassign Appointment to Different Doctor
```javascript
const reassignAppointment = async (appointmentId, newDoctorId, reason) => {
  const response = await fetch(
    `${API_BASE_URL}/appointments/${appointmentId}/reassign`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        doctorId: newDoctorId,
        reason: reason
      })
    }
  );
  return response.json();
};
```

## 👤 Patient Booking Flow

### 1. Get Hospitals
```javascript
const getHospitals = async () => {
  const response = await fetch(`${API_BASE_URL}/hospitals`);
  return response.json();
};
```

### 2. Get Departments by Hospital
```javascript
const getDepartments = async (hospitalId) => {
  const response = await fetch(
    `${API_BASE_URL}/departments?hospital=${hospitalId}`
  );
  return response.json();
};
```

### 3. Get Doctors by Department
```javascript
const getDoctorsByDepartment = async (departmentId) => {
  const response = await fetch(
    `${API_BASE_URL}/doctors/department/${departmentId}`
  );
  return response.json();
};
```

### 4. Get Available Slots
```javascript
const getAvailableSlots = async (hospitalId, date, departmentId) => {
  const params = new URLSearchParams({
    hospital: hospitalId,
    date: date,
    department: departmentId
  });
  
  const response = await fetch(
    `${API_BASE_URL}/appointments/available-slots?${params}`
  );
  return response.json();
};
```

### 5. Book Appointment
```javascript
const bookAppointment = async (appointmentData) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      hospital: appointmentData.hospitalId,
      department: appointmentData.departmentId,
      doctor: appointmentData.doctorId, // Optional
      appointmentType: appointmentData.type, // 'virtual' or 'in-person'
      appointmentDate: appointmentData.date,
      appointmentTime: appointmentData.time,
      reasonForVisit: appointmentData.reason,
      patientDetails: {
        fullName: appointmentData.patientName,
        email: appointmentData.patientEmail,
        phoneNumber: appointmentData.patientPhone,
        age: appointmentData.patientAge,
        gender: appointmentData.patientGender,
        address: appointmentData.patientAddress,
        emergencyContact: appointmentData.emergencyContact
      },
      consultationFee: appointmentData.fee
    })
  });
  return response.json();
};
```

## 📊 Dashboard Data (Hospital)

### Get Hospital Statistics
```javascript
const getHospitalStats = async () => {
  const response = await fetch(
    `${API_BASE_URL}/appointments/hospital-stats`,
    { headers: getAuthHeaders() }
  );
  return response.json();
};
```

## 🚨 Error Handling
```javascript
const handleApiResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};
```

## 🔄 Real-time Updates
Consider implementing WebSocket connections for real-time appointment updates:
```javascript
const ws = new WebSocket('ws://localhost:5000/ws');
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  if (update.type === 'appointment_created') {
    // Refresh appointment list
  }
};
```

## 📱 Role-Based UI Components

### Hospital Dashboard
- Patient list with search
- Doctor management
- Appointment calendar
- Statistics widgets

### Patient Portal  
- Appointment booking wizard
- Medical history
- Prescription management
- Insurance information

### Doctor Interface
- Schedule management
- Patient consultations
- Medical records access

This guide provides everything needed for complete frontend integration with the enhanced backend system.