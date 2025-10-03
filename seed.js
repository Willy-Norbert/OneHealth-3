const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");
const { createSendToken, signToken } = require('./utils/jwt'); // Import createSendToken and signToken

// MODELS
const Department = require('./models/Department');
const Hospital = require('./models/Hospital');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Emergency = require('./models/Emergency');
const Insurance = require('./models/Insurance');
const Pharmacy = require('./models/Pharmacy');
const Prescription = require('./models/Prescription');
const Order = require('./models/Order');
const MedicalRecord = require('./models/MedicalRecord');
const Teleconsultation = require('./models/Teleconsultation');
const Patient = require('./models/Patient');

// --- CONSULTATION TYPE MODEL ---
const ConsultationType =
  mongoose.models.ConsultationType ||
  mongoose.model(
    'ConsultationType',
    new mongoose.Schema({
      name: { type: String, required: true },
      description: String,
      baseFee: { type: Number, default: 0 },
    })
  );

// --- CONFIG ---
const hashPassword = (pwd) => bcrypt.hashSync(pwd, 10);

const defaultProfileImageUrl = 'https://res.cloudinary.com/your_cloud_name/image/upload/v1700000000/default_profile_image.png'; // Replace with your actual default image URL

// --- CONNECT TO MONGO ---
mongoose
  .connect(
    'mongodb+srv://wiseacademy:01402@cluster0.bsxehn0.mongodb.net/onehealth?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- HELPERS ---
const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  try {
    // --- CLEAN DATABASE ---
    await Promise.all([
      Patient.deleteMany({}),
      Appointment.deleteMany({}),
      Emergency.deleteMany({}),
      MedicalRecord.deleteMany({}),
      Order.deleteMany({}),
      Prescription.deleteMany({}),
      Pharmacy.deleteMany({}),
      Insurance.deleteMany({}),
      Doctor.deleteMany({}),
      Department.deleteMany({}),
      Hospital.deleteMany({}),
      Teleconsultation.deleteMany({}),
      ConsultationType.deleteMany({}),
      User.deleteMany({}),
    ]);

    // --- DEFAULT WORKING HOURS ---
    const defaultWorkingHours = {
      monday: { start: '08:00', end: '18:00' },
      tuesday: { start: '08:00', end: '18:00' },
      wednesday: { start: '08:00', end: '18:00' },
      thursday: { start: '08:00', end: '18:00' },
      friday: { start: '08:00', end: '18:00' },
      saturday: { start: '09:00', end: '14:00' },
      sunday: { start: 'Closed', end: 'Closed' },
    };

    // --- HOSPITALS ---
    const hospitals = await Hospital.insertMany([
      {
        name: 'Kigali University Hospital',
        location: 'Kigali',
        address: 'KG 7 Ave, Kigali',
        contact: { phone: '+250788123456', email: 'info@kigaliuniversityhospital.rw' },
        services: ['Emergency Care', 'Surgery', 'General Medicine', 'Radiology'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: "Rwanda Children's Hospital",
        location: 'Kigali',
        address: 'KN 5 Ave, Kigali',
        contact: { phone: '+250788654321', email: 'contact@rch.rw' },
        services: ['Pediatrics', 'General Medicine', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Hope Valley Hospital',
        location: 'Musanze',
        address: 'MS 10 St, Musanze',
        contact: { phone: '+250788777888', email: 'info@hopevalley.rw' },
        services: ['Orthopedics', 'Emergency Care', 'Surgery'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Sunrise Medical Center',
        location: 'Huye',
        address: 'HY 3 Ave, Huye',
        contact: { phone: '+250788999000', email: 'hello@sunrisemc.rw' },
        services: ['Dermatology', 'Ophthalmology', 'General Medicine'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
    ]);

    // --- DEPARTMENTS ---
    const deptData = [
      ['General Medicine', 5000, 0],
      ['Cardiology', 10000, 0],
      ['Pediatrics', 6000, 1],
      ['Surgery', 15000, 1],
      ['Orthopedics', 12000, 2],
      ['Emergency Medicine', 8000, 2],
      ['Dermatology', 7000, 3],
      ['Ophthalmology', 9000, 3],
      ['Neurology', 11000, 0],
      ['Psychiatry', 9000, 3],
      ['Oncology', 14000, 0],
      ['Urology', 9500, 0],
    ];

    const departments = await Department.insertMany(
      deptData.map(([name, fee, hIdx]) => ({
        name,
        description: `${name} department`,
        hospital: hospitals[hIdx]._id,
        services: ['Consultation', 'Diagnostics'],
        consultationFee: fee,
        isActive: true,
      }))
    );

    // --- LINK DEPARTMENTS TO HOSPITALS ---
    for (const dept of departments) {
      await Hospital.findByIdAndUpdate(dept.hospital, { $push: { departments: dept._id } });
    }

    // --- INSURANCE ---
    const insurance = await Insurance.insertMany([
      { name: 'Mutuelle de Santé', type: 'Public', coveragePercentage: 80 },
      { name: 'RSSB', type: 'Public', coveragePercentage: 85 },
      { name: 'Radiant', type: 'Private', coveragePercentage: 70 },
      { name: 'Sanlam', type: 'Private', coveragePercentage: 75 },
    ]);

    // --- USERS (ADMINS & HOSPITAL STAFF) ---
    const adminUsers = await User.insertMany([
      {
        name: 'Platform Admin',
        email: 'admin@onehealth.rw',
        password: hashPassword('Admin#123'),
        role: 'admin',
        isActive: true,
        isVerified: true,
        profileImage: defaultProfileImageUrl,
      },
      {
        name: 'Kigali Hosp Admin',
        email: 'kgh-admin@onehealth.rw',
        password: hashPassword('Admin#123'),
        role: 'hospital',
        hospital: hospitals[0]._id,
        isActive: true,
        isVerified: true,
        profileImage: defaultProfileImageUrl,
      },
      {
        name: 'RCH Admin',
        email: 'rch-admin@onehealth.rw',
        password: hashPassword('Admin#123'),
        role: 'hospital',
        hospital: hospitals[1]._id,
        isActive: true,
        isVerified: true,
        profileImage: defaultProfileImageUrl,
      },
      {
        name: 'Sunrise Admin',
        email: 'sunrise-admin@onehealth.rw',
        password: hashPassword('Admin#123'),
        role: 'hospital',
        hospital: hospitals[3]._id,
        isActive: true,
        isVerified: true,
        profileImage: defaultProfileImageUrl,
      },
    ]);

    // Link hospital admin users to their respective hospitals
    for (const user of adminUsers) {
      if (user.role === 'hospital' && user.hospital) {
        await Hospital.findByIdAndUpdate(user.hospital, { userId: user._id });
      }
    }

    console.log('Admin login: admin@onehealth.rw | Password: Admin#123');
    console.log('Hospital Admins:');
    adminUsers.filter(u => u.role === 'hospital').forEach(u => {
      console.log(`- ${u.email} | Password: Admin#123 | Hospital ID: ${u.hospital}`);
      const mockRes = {
        cookie: (name, token, options) => { mockRes.storedToken = token; },
        status: (code) => mockRes, // Chainable method
        json: (data) => { /* console.log(data); */ }
      };
      const hospitalToken = signToken(u._id); // Directly generate token
      console.log(`Explicitly logged JWT Token for ${u.email}: ${hospitalToken}`); // Log the token
    });

    // --- DOCTORS ---
    const doctors = [];
    for (const dept of departments) {
      for (let j = 0; j < 2; j++) {
        const doctorUser = await User.create({
          name: `Dr. ${dept.name} ${j + 1}`,
          email: `doctor_${dept.name.toLowerCase().replace(/\s+/g, '')}${j + 1}@onehealth.rw`,
          password: hashPassword('Doctor#123'),
          role: 'doctor',
          isActive: true,
          isVerified: true,
          profileImage: defaultProfileImageUrl,
        });

        const doctor = await Doctor.create({
          user: doctorUser._id,
          licenseNumber: `LIC-${dept._id.toString().slice(-4)}-${j + 1}`,
          specialization: dept.name,
          hospital: dept.hospital,
          department: dept._id,
          consultationFee: dept.consultationFee,
          rating: { average: 0, count: 0 },
          availability: {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            timeSlots: [
              { start: '09:00', end: '12:00' },
              { start: '14:00', end: '17:00' }
            ]
          },
          bio: `Experienced ${dept.name} doctor.`,
          experience: Math.floor(Math.random() * 20),
          consultationModes: ['in-person', 'video-call']
        });

        await Hospital.findByIdAndUpdate(dept.hospital, { $push: { doctors: doctor._id } });
        await Department.findByIdAndUpdate(dept._id, { $push: { doctors: doctor._id } });

        doctors.push(doctor);

        console.log(`Doctor login: ${doctorUser.email} | Password: Doctor#123`);
      }
    }

    // --- PATIENTS ---
    const patientNames = [
      'John Patient', 'Mary Patient', 'Paul Patient', 'Alice Patient',
      'Eric Patient', 'Grace Patient', 'Irene Patient', 'Noah Patient',
      'Olivia Patient', 'Ethan Patient', 'Mason Patient', 'Sophia Patient'
    ];

    const patients = await User.insertMany(
      patientNames.map((n, i) => ({
        name: n,
        email: `patient${i + 1}@onehealth.rw`,
        password: hashPassword('Patient#123'),
        role: 'patient',
        isActive: true,
        isVerified: true,
        profileImage: defaultProfileImageUrl,
      }))
    );

    patients.forEach((p, i) => {
      console.log(`Patient login: ${p.email} | Password: Patient#123`);
    });

    // --- PATIENT PROFILES ---
    const patientProfiles = [];
    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      const profile = await Patient.create({
  patientId: `P-${i + 1}-${uuidv4().slice(0, 6)}`, // Unique patientId
  user: patient._id,
  dateOfBirth: new Date(
    1985 + Math.floor(Math.random() * 20),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28)
  ),
  gender: i % 2 === 0 ? 'Male' : 'Female',
  bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
  phone: `+25078${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
  address: {
    street: `Street ${i + 1}`,
    city: ['Kigali', 'Huye', 'Musanze', 'Nyagatare'][Math.floor(Math.random() * 4)],
    district: 'District ' + (i % 3 + 1),
    province: ['Kigali', 'Southern', 'Northern', 'Eastern'][Math.floor(Math.random() * 4)],
    country: 'Rwanda',
  },
  emergencyContact: {
    name: `Emergency Contact ${i + 1}`,
    relationship: ['Spouse', 'Parent', 'Sibling', 'Friend'][Math.floor(Math.random() * 4)],
    phone: `+25078${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
  },
  allergies: i % 3 === 0 ? ['Penicillin'] : i % 3 === 1 ? ['Nuts', 'Shellfish'] : [],
  chronicConditions: i % 4 === 0 ? ['Hypertension'] : i % 4 === 1 ? ['Diabetes'] : [],
  insurance: {
    provider: insurance[i % insurance.length].name,
    policyNumber: `POL-${String(Math.floor(Math.random() * 900000) + 100000)}`,
    coveragePercentage: insurance[i % insurance.length].coveragePercentage,
  },
  primaryHospital: hospitals[i % hospitals.length]._id,
  visitedHospitals: [
    {
      hospital: hospitals[i % hospitals.length]._id,
      firstVisit: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      totalVisits: Math.floor(Math.random() * 10) + 1,
    },
  ],
});

      patientProfiles.push(profile);
    }

    console.log(`Created ${patientProfiles.length} patient profiles`);

    // --- SAMPLE APPOINTMENTS ---
    const sampleAppointments = [];
    for (let i = 0; i < 20; i++) {
      const randomPatient = patients[Math.floor(Math.random() * patients.length)];
      const randomHospital = hospitals[Math.floor(Math.random() * hospitals.length)];
      const hospitalDepts = departments.filter(d => d.hospital.toString() === randomHospital._id.toString());
      const randomDept = hospitalDepts[Math.floor(Math.random() * hospitalDepts.length)];
      const deptDoctors = doctors.filter(d => d.department.toString() === randomDept._id.toString());
      const randomDoctor = deptDoctors[Math.floor(Math.random() * deptDoctors.length)];

      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30));
      
      const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];

      const appointment = await Appointment.create({
        patient: randomPatient._id,
        doctor: randomDoctor.user,
        hospital: randomHospital._id,
        department: randomDept._id,
        appointmentType: Math.random() > 0.5 ? 'in-person' : 'virtual',
        appointmentDate: appointmentDate,
        appointmentTime: randomTime,
        reasonForVisit: [
          'General Checkup',
          'Follow-up visit',
          'Consultation',
          'Routine examination',
          'Health screening'
        ][Math.floor(Math.random() * 5)],
        previousVisit: Math.random() > 0.5,
        patientDetails: {
          fullName: randomPatient.name,
          email: randomPatient.email,
          phoneNumber: `+25078${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
          age: 25 + Math.floor(Math.random() * 40),
          gender: i % 2 === 0 ? 'Male' : 'Female',
          address: `Address for ${randomPatient.name}`,
          emergencyContact: {
            name: `Emergency Contact ${i + 1}`,
            phone: `+25078${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
            relationship: 'Family'
          }
        },
        status: ['pending', 'confirmed', 'completed'][Math.floor(Math.random() * 3)],
        consultationFee: randomDept.consultationFee || 25000,
        paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending'
      });

      sampleAppointments.push(appointment);
    }

    console.log(`Created ${sampleAppointments.length} sample appointments`);

    // --- PHARMACIES ---
    const pharmacies = await Pharmacy.insertMany([
      {
        name: 'CityCare Pharmacy',
        location: { address: 'KG 15 Ave', city: 'Kigali', district: 'Gasabo', coordinates: { latitude: -1.944, longitude: 30.061 } },
        contact: { phone: '+250780000001', email: 'contact@citycarepharma.rw', website: 'https://citycare.rw' },
        services: ['Prescription Filling','Over-the-counter Medications','Home Delivery'],
        insuranceAccepted: [insurance[0]._id, insurance[2]._id],
        licenseNumber: 'PHARM-0001',
        deliveryRadius: 12,
        deliveryFee: 500,
      },
      {
        name: 'Valley Drugs',
        location: { address: 'MS 8 Rd', city: 'Musanze', district: 'Musanze', coordinates: { latitude: -1.504, longitude: 29.636 } },
        contact: { phone: '+250780000002', email: 'info@valleydrugs.rw' },
        services: ['Prescription Filling','Medical Supplies','Online Ordering'],
        insuranceAccepted: [insurance[1]._id, insurance[3]._id],
        licenseNumber: 'PHARM-0002',
      },
      {
        name: 'Sunrise Pharma',
        location: { address: 'HY 2 St', city: 'Huye', district: 'Huye', coordinates: { latitude: -2.602, longitude: 29.740 } },
        contact: { phone: '+250780000003', email: 'hello@sunrisepharma.rw' },
        services: ['Prescription Filling','Vaccination Services'],
        insuranceAccepted: [insurance[0]._id, insurance[1]._id],
        licenseNumber: 'PHARM-0003',
      },
      {
        name: 'Downtown Meds',
        location: { address: 'KN 1 Rd', city: 'Kigali', district: 'Nyarugenge', coordinates: { latitude: -1.943, longitude: 30.059 } },
        contact: { phone: '+250780000004' },
        services: ['Over-the-counter Medications','Online Ordering','Home Delivery'],
        insuranceAccepted: [insurance[2]._id],
        licenseNumber: 'PHARM-0004',
      },
    ]);

    // --- CONSULTATION TYPES ---
    const consultTypes = await ConsultationType.insertMany([
      { name: 'General Teleconsultation', description: '15-min video call', baseFee: 5000 },
      { name: 'Specialist Teleconsultation', description: '30-min video call', baseFee: 10000 },
      { name: 'Follow-up Call', description: '10-min phone call', baseFee: 3000 },
    ]);

    console.log('✅ Seed completed successfully!');
    console.log(`Hospitals: ${hospitals.length}`);
    console.log(`Departments: ${departments.length}`);
    console.log(`Users: ${adminUsers.length + doctors.length + patients.length}`);
    console.log(`Doctors: ${doctors.length}`);
    console.log(`Patient Profiles: ${patientProfiles.length}`);
    console.log(`Sample Appointments: ${sampleAppointments.length}`);
    console.log(`Pharmacies: ${pharmacies.length}`);
    console.log(`Consultation Types: ${consultTypes.length}`);

  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
