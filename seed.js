/**
 * ========================================================================
 * RWANDA HEALTH SYSTEM DATABASE SEEDER
 * ========================================================================
 * 
 * SYNTHETIC DATA ONLY - FOR TESTING AND DEVELOPMENT PURPOSES
 * 
 * This script populates MongoDB with realistic Rwandan hospital test data.
 * All data is synthetic and generated randomly. No real patient information.
 * 
 * Usage:
 *   node seed.js
 *   or
 *   npm run seed
 * 
 * ========================================================================
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");
const { createSendToken, signToken } = require('./utils/jwt');

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

// ========================================================================
// CONFIGURATION
// ========================================================================

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://wiseacademy:01402@cluster0.bsxehn0.mongodb.net/onehealth?retryWrites=true&w=majority&appName=Cluster0';
const BATCH_SIZE = 1000; // Increased batch size for faster inserts
const hashPassword = (pwd) => bcrypt.hashSync(pwd, 10);
const defaultProfileImageUrl = 'https://res.cloudinary.com/your_cloud_name/image/upload/v1700000000/default_profile_image.png';

// ========================================================================
// RWANDAN DATA POOLS
// ========================================================================

const RWANDAN_FIRST_NAMES = [
  'Jean', 'Alice', 'Emmanuel', 'Aline', 'Olivier', 'Chantal', 'Fabrice', 'Ange',
  'Jean-Pierre', 'Ivy', 'Godfrey', 'Claude', 'Eric', 'Solange', 'Marie', 'Bruno',
  'Aimable', 'Diane', 'Pascal', 'Thierry', 'Beatha', 'Innocent', 'Jean Bosco',
  'Theoneste', 'Duterimbere'
];

const RWANDAN_LAST_NAMES = [
  'Uwimana', 'Niyonzima', 'Uwase', 'Nkurunziza', 'Munyaneza', 'Ndabarasa',
  'Mukamana', 'Harerimana', 'Habimana', 'Rugeramigabo', 'Uwitonze', 'Maniraguha',
  'Ishimwe', 'Rutembesa', 'Mupenzi', 'Rukundo', 'Nshimiyimana', 'Rutayisire',
  'Uwizeyimana', 'Tuyishime'
];

const PROVINCES = ['Kigali', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province'];
const DISTRICTS_KIGALI = ['Gasabo', 'Nyarugenge', 'Kicukiro'];
const DISTRICTS_OTHER = ['Musanze', 'Huye', 'Rubavu', 'Nyamagabe', 'Rusizi', 'Karongi', 'Rutsiro', 'Nyamasheke'];
const CITIES = ['Kigali', 'Butare', 'Musanze', 'Rubavu', 'Nyamata', 'Muhanga', 'Gitarama', 'Byumba'];

const MEDICATIONS = [
  'Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Aspirin', 'Metformin', 'Atenolol',
  'Omeprazole', 'Ciprofloxacin', 'Azithromycin', 'Amoxiclav', 'Metronidazole',
  'Doxycycline', 'Clarithromycin', 'Ceftriaxone', 'Gentamicin'
];

const DIAGNOSES = [
  'Hypertension', 'Diabetes Type 2', 'Malaria', 'Respiratory Infection',
  'Gastroenteritis', 'Urinary Tract Infection', 'Skin Infection', 'Anemia',
  'Headache', 'Fever', 'Cough', 'Common Cold', 'Bronchitis', 'Pneumonia',
  'Asthma', 'Arthritis', 'Gastritis', 'Peptic Ulcer Disease'
];

// ========================================================================
// UTILITY FUNCTIONS
// ========================================================================

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomPhone() {
  const prefixes = [8, 3, 2, 5, 1, 7, 9];
  const prefix = randomItem(prefixes);
  const digits = Math.floor(1000000 + Math.random() * 9000000);
  return `+2507${prefix}${digits}`;
}

function randomEmail(firstName, lastName, type, index) {
  // All emails use @gmail.com format
  const firstNameClean = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const lastNameClean = lastName.toLowerCase().replace(/[^a-z]/g, '');
  
  if (type === 'admin') {
    return `admin${index || ''}@gmail.com`;
  } else if (type === 'hospital') {
    return `${firstNameClean}${lastNameClean}@gmail.com`;
  } else if (type === 'doctor') {
    return `${firstNameClean}${lastNameClean}${index || ''}@gmail.com`;
  } else {
    // patient
    return `${firstNameClean}${lastNameClean}${index || ''}@gmail.com`;
  }
}

function generateRwandanName() {
  return {
    firstName: randomItem(RWANDAN_FIRST_NAMES),
    lastName: randomItem(RWANDAN_LAST_NAMES)
  };
}

function generateRwandanAddress() {
  const province = randomItem(PROVINCES);
  let district, city;
  
  if (province === 'Kigali') {
    district = randomItem(DISTRICTS_KIGALI);
    city = 'Kigali';
  } else {
    district = randomItem(DISTRICTS_OTHER);
    city = randomItem(CITIES);
  }
  
  const sectors = ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5'];
  const cells = ['Cell A', 'Cell B', 'Cell C'];
  const village = `Village ${randomInt(1, 10)}`;
  
  return {
    street: `${randomItem(sectors)}, ${randomItem(cells)}, ${village}`,
    city,
    district,
    province,
    country: 'Rwanda'
  };
}

// --- CONNECT TO MONGO ---
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}

// --- HELPERS ---
const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  console.log('\n🌱 ============================================');
  console.log('🌱 RWANDA HEALTH SYSTEM DATABASE SEEDER');
  console.log('🌱 ============================================\n');
  
  console.log('📡 Connecting to MongoDB...');
  console.log(`   URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}\n`);
  
  try {
    await connectDB();
    
    console.log('\n🗑️  Deleting all existing data...');
    console.log('   This will remove all users, hospitals, doctors, patients, appointments, and records...\n');
    
    // --- CLEAN DATABASE (Delete all existing data first) ---
    const deleteResults = await Promise.all([
      Emergency.deleteMany({}),
      Order.deleteMany({}),
      Teleconsultation.deleteMany({}),
      Prescription.deleteMany({}),
      MedicalRecord.deleteMany({}),
      Appointment.deleteMany({}),
      Patient.deleteMany({}),
      Doctor.deleteMany({}),
      Department.deleteMany({}),
      Pharmacy.deleteMany({}),
      Insurance.deleteMany({}),
      ConsultationType.deleteMany({}),
      Hospital.deleteMany({}),
      User.deleteMany({}),
    ]);
    
    console.log('✅ All existing data deleted successfully');
    console.log('   - Deleted all users, hospitals, doctors, patients, appointments, records, and related data\n');

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

    // --- HOSPITALS (10 hospitals total) ---
    const hospitals = await Hospital.insertMany([
      {
        name: 'La Medicale Clinic',
        location: 'Huye District, Southern Province',
        address: 'Avenue Buye, Huye District, Southern Province',
        contact: { phone: '+250788123456', email: 'lamedicaleclinic@gmail.com' },
        services: ['Emergency Care', 'General Medicine', 'Cardiology', 'Pediatrics', 'Gynecology', 'Surgery', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Salus Polyclinic',
        location: 'Huye District, Southern Province',
        address: 'Butare town, Huye District, Southern Province',
        contact: { phone: '+250788654321', email: 'saluspolyclinic@gmail.com' },
        services: ['Emergency Care', 'General Medicine', 'Orthopedics', 'Pediatrics', 'Surgery', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Sangwa Polyclinic Ltd',
        location: 'Huye District, Southern Province',
        address: 'Near IPRC Huye / University of Rwanda – Huye Campus, Huye District',
        contact: { phone: '+250788777888', email: 'sangwapolyclinic@gmail.com' },
        services: ['Emergency Care', 'General Medicine', 'Dermatology', 'Pediatrics', 'Surgery', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Kabutare Hospital',
        location: 'Huye District, Southern Province',
        address: 'Huye, Rwanda',
        contact: { phone: '+250788999000', email: 'kabutarehospital@gmail.com' },
        services: ['Emergency Care', 'General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Clinique Médicale de Huye',
        location: 'Huye District, Southern Province',
        address: 'Butare, Huye District, Near Place',
        contact: { phone: '+250788111222', email: 'cliniquedehuye@gmail.com' },
        services: ['General Medicine', 'Pediatrics', 'Gynecology', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Rukira Health Centre',
        location: 'Huye District, Southern Province',
        address: 'Huye, Rwanda, Near Place',
        contact: { phone: '+250788333444', email: 'rukirahealth@gmail.com' },
        services: ['General Medicine', 'Pediatrics', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Igihozo Medical Clinic Ltd',
        location: 'Southern Province, Rwanda',
        address: 'MQ26+QVW Road, Nyanza, Southern Province, Rwanda',
        contact: { phone: '+250788555666', email: 'igihozoclinic@gmail.com' },
        services: ['General Medicine', 'Pediatrics', 'Gynecology', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Polyclinique Médicale la Providence',
        location: 'Southern Province, Rwanda',
        address: 'Gahogo Cell, Nyamabuye Sector, Muhanga District, Southern Province',
        contact: { phone: '+250788777888', email: 'laprovidence@gmail.com' },
        services: ['General Medicine', 'Cardiology', 'Pediatrics', 'Surgery', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Clinique Médicale La Bénédiction',
        location: 'Southern Province, Rwanda',
        address: 'Muhanga District, Southern Province',
        contact: { phone: '+250788999111', email: 'labenediction@gmail.com' },
        services: ['General Medicine', 'Dentistry', 'Pediatrics', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Rwanda Dispatch Health Centre',
        location: 'Southern Province, Rwanda',
        address: 'Muhanga District, Southern Province',
        contact: { phone: '+250788222333', email: 'rwandadispatch@gmail.com' },
        services: ['General Medicine', 'Emergency Care', 'Pediatrics', 'Laboratory', 'Pharmacy'],
        workingHours: defaultWorkingHours,
        isApproved: true,
        isActive: true,
      },
    ]);

    // --- DEPARTMENTS (Ensure each hospital has at least 1-2 departments, total 10-15 departments) ---
    const departmentNames = [
      'General Medicine', 'Cardiology', 'Pediatrics', 'Gynecology', 'Orthopedics',
      'Dermatology', 'Neurology', 'Psychiatry', 'Emergency Medicine', 'Surgery',
      'Oncology', 'Ophthalmology', 'ENT', 'Urology', 'Endocrinology', 'Mental Health', 'Dentistry'
    ];
    
    // Ensure each hospital has at least 1 department, then add more
    const departments = [];
    let deptIndex = 0;
    
    // First, assign at least one department to each hospital
    for (let i = 0; i < hospitals.length; i++) {
      const deptName = departmentNames[deptIndex % departmentNames.length];
      departments.push({
        name: deptName,
        description: `${deptName} department at ${hospitals[i].name}`,
        hospital: hospitals[i]._id,
        consultationFee: randomInt(5000, 20000),
        isActive: true,
      });
      deptIndex++;
    }
    
    // Then add more departments distributed across hospitals (total 10-15 departments)
    const additionalDepts = randomInt(0, 5); // Add 0-5 more departments
    for (let i = 0; i < additionalDepts; i++) {
      const deptName = departmentNames[deptIndex % departmentNames.length];
      const hospital = randomItem(hospitals);
      // Avoid duplicate department names in same hospital
      const existingDeptNames = departments
        .filter(d => d.hospital.toString() === hospital._id.toString())
        .map(d => d.name);
      if (!existingDeptNames.includes(deptName)) {
        departments.push({
          name: deptName,
          description: `${deptName} department at ${hospital.name}`,
          hospital: hospital._id,
          consultationFee: randomInt(5000, 20000),
          isActive: true,
        });
      }
      deptIndex++;
    }
    
    const createdDepartments = await Department.insertMany(departments);

    // --- LINK DEPARTMENTS TO HOSPITALS ---
    for (const dept of createdDepartments) {
      await Hospital.findByIdAndUpdate(dept.hospital, { $push: { departments: dept._id } });
    }

    // --- INSURANCE (At least 3, including Mutuelle de Santé and RSSB) ---
    const insurance = await Insurance.insertMany([
      { name: 'Mutuelle de Santé', type: 'Public', coveragePercentage: 90, isActive: true },
      { name: 'RSSB', type: 'Public', coveragePercentage: 85, isActive: true },
      { name: 'Radiant', type: 'Private', coveragePercentage: 80, isActive: true },
      { name: 'Sanlam', type: 'Private', coveragePercentage: 75, isActive: true },
      { name: 'Radiant Life', type: 'Private', coveragePercentage: 70, isActive: true },
    ]);

    // --- USERS (ADMINS & HOSPITAL STAFF) ---
    // Platform Admin
    const platformAdminName = generateRwandanName();
    const platformAdmin = await User.create({
      firstName: platformAdminName.firstName,
      lastName: platformAdminName.lastName,
      name: `${platformAdminName.firstName} ${platformAdminName.lastName}`,
      email: randomEmail(platformAdminName.firstName, platformAdminName.lastName, 'admin', 1),
        password: hashPassword('Admin#123'),
        role: 'admin',
      phone: randomPhone(),
        isActive: true,
        isVerified: true,
      profileImageUrl: defaultProfileImageUrl,
      province: 'Kigali',
      district: 'Gasabo'
    });
    
    // Hospital Admins (one for each hospital) - each with unique name
    const hospitalAdmins = [];
    const usedNames = new Set([`${platformAdminName.firstName} ${platformAdminName.lastName}`]);
    
    for (let i = 0; i < hospitals.length; i++) {
      let name;
      let nameKey;
      // Generate unique name
      do {
        name = generateRwandanName();
        nameKey = `${name.firstName} ${name.lastName}`;
      } while (usedNames.has(nameKey));
      
      usedNames.add(nameKey);
      
      const admin = await User.create({
        firstName: name.firstName,
        lastName: name.lastName,
        name: nameKey,
        email: randomEmail(name.firstName, name.lastName, 'hospital', i + 1),
        password: hashPassword('Admin#123'),
        role: 'hospital',
        hospital: hospitals[i]._id,
        phone: randomPhone(),
        isActive: true,
        isVerified: true,
        profileImageUrl: defaultProfileImageUrl,
        ...generateRwandanAddress()
      });
      hospitalAdmins.push(admin);
    }
    
    const adminUsers = [platformAdmin, ...hospitalAdmins];

    // Link hospital admin users to their respective hospitals
    for (const user of adminUsers) {
      if (user.role === 'hospital' && user.hospital) {
        await Hospital.findByIdAndUpdate(user.hospital, { userId: user._id });
      }
    }

    // --- DOCTORS (240+ doctors to match stats) - Bulk insert for speed ---
    const doctorCount = 240; // Exact number for stats
    const doctors = [];
    const doctorUsers = [];
    let doctorIndex = 1;
    
    console.log(`Creating ${doctorCount} doctors using bulk operations...`);
    
    // Track used names to ensure uniqueness
    const usedDoctorNames = new Set([...usedNames]);
    
    // Prepare all doctor data first
    const doctorUsersData = [];
    const doctorsData = [];
    
    for (let i = 0; i < doctorCount; i++) {
      let name;
      let nameKey;
      // Generate unique name
      do {
        name = generateRwandanName();
        nameKey = `${name.firstName} ${name.lastName}`;
      } while (usedDoctorNames.has(nameKey));
      
      usedDoctorNames.add(nameKey);
      
      const hospital = randomItem(hospitals);
      const hospitalDepts = createdDepartments.filter(d => d.hospital.toString() === hospital._id.toString());
      
      // Fallback: if hospital has no departments, use any department or a default
      let department = randomItem(hospitalDepts);
      if (!department) {
        // If this hospital has no departments, use any available department
        department = randomItem(createdDepartments);
      }
      if (!department) {
        // Ultimate fallback: use a default specialization
        department = { name: 'General Medicine', _id: null };
      }
      const specialization = department.name;
      
      doctorUsersData.push({
        firstName: name.firstName,
        lastName: name.lastName,
        name: `Dr. ${name.firstName} ${name.lastName}`,
        email: randomEmail(name.firstName, name.lastName, 'doctor', doctorIndex),
          password: hashPassword('Doctor#123'),
          role: 'doctor',
        phone: randomPhone(),
          isActive: true,
          isVerified: true,
        profileImageUrl: defaultProfileImageUrl,
        ...generateRwandanAddress()
      });
      
      doctorsData.push({
        // user will be set after User.insertMany
        licenseNumber: `LIC-${Date.now()}-${doctorIndex}-${i}`,
        specialization,
        hospital: hospital._id,
        department: department._id || createdDepartments[0]?._id || null,
        experience: randomInt(1, 25),
        education: [{
          degree: 'MD',
          institution: 'University of Rwanda',
          year: new Date().getFullYear() - randomInt(5, 30)
        }],
        languages: ['Kinyarwanda', 'English', 'French'],
        consultationModes: ['in-person', 'video-call', 'phone-call'],
          availability: {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          timeSlots: [{ start: '08:00', end: '17:00' }]
        },
        consultationFee: randomInt(5000, 20000),
        isActive: true,
        rating: {
          average: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          count: randomInt(10, 100)
        },
        bio: `Experienced ${specialization} doctor at ${hospital.name}.`
      });
      
      doctorIndex++;
    }
    
    // Bulk insert users
    console.log('   Inserting doctor users in bulk...');
    const insertedDoctorUsers = await User.insertMany(doctorUsersData);
    doctorUsers.push(...insertedDoctorUsers);
    
    // Link users to doctors
    for (let i = 0; i < insertedDoctorUsers.length; i++) {
      doctorsData[i].user = insertedDoctorUsers[i]._id;
    }
    
    // Bulk insert doctors
    console.log('   Inserting doctors in bulk...');
    const insertedDoctors = await Doctor.insertMany(doctorsData);
    doctors.push(...insertedDoctors);
    
    console.log(`✅ Created ${doctors.length} doctors`);
    
    // Sample doctor for credentials display
    const sampleDoctor = doctorUsers[0];

    // --- PATIENTS (249 patients) - Bulk insert for speed ---
    const patientCount = 249;
    const patients = [];
    const patientUsers = [];
    let patientSeq = 1;
    
    console.log(`Creating ${patientCount} patients using bulk operations...`);
    console.log(`Progress: 0% (0/${patientCount})`);
    
    // Track used patient names to ensure uniqueness
    const usedPatientNames = new Set([...usedDoctorNames]);
    
    // Prepare all patient data first (like doctors)
    const patientUsersData = [];
    const patientsData = [];
    
    for (let i = 0; i < patientCount; i++) {
      // Show progress every 10 patients or at milestones
      if ((i + 1) % 10 === 0 || i === 0 || i === Math.floor(patientCount * 0.25) || i === Math.floor(patientCount * 0.5) || i === Math.floor(patientCount * 0.75) || i === patientCount - 1) {
        const progress = Math.round(((i + 1) / patientCount) * 100);
        process.stdout.write(`\rProgress: ${progress}% (${i + 1}/${patientCount}) - Preparing patient data...`);
      }
      let name;
      let nameKey;
      // Generate unique name
      do {
        name = generateRwandanName();
        nameKey = `${name.firstName} ${name.lastName}`;
      } while (usedPatientNames.has(nameKey));
      
      usedPatientNames.add(nameKey);
      
      const dob = randomDate(new Date(1950, 0, 1), new Date(2010, 11, 31));
      const age = new Date().getFullYear() - dob.getFullYear();
      const gender = randomItem(['Male', 'Female', 'Other']);
      const address = generateRwandanAddress();
      const insuranceProvider = randomItem(insurance);
      
      patientUsersData.push({
        firstName: name.firstName,
        lastName: name.lastName,
        name: nameKey,
        email: randomEmail(name.firstName, name.lastName, 'patient', patientSeq),
        password: hashPassword('Patient#123'),
        role: 'patient',
        phone: randomPhone(),
        nationalId: `${randomInt(1, 999)}${randomInt(100000000, 999999999)}`,
        dob,
        gender,
        bloodGroup: randomItem(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
        address: address.street,
        district: address.district,
        province: address.province,
        ubudehe: randomInt(1, 4),
        emergencyContact: {
          name: `${generateRwandanName().firstName} ${generateRwandanName().lastName}`,
          relationship: randomItem(['Spouse', 'Parent', 'Sibling', 'Friend', 'Other']),
          phone: randomPhone()
        },
        insurance: {
          type: insuranceProvider.type,
          insurerName: insuranceProvider.name,
          policyNumber: `POL-${randomInt(100000, 999999)}`,
          expiryDate: randomDate(new Date(), new Date(2026, 11, 31))
        },
        allergies: randomItems(['Penicillin', 'Sulfa', 'Latex', 'Peanuts', 'Dust'], randomInt(0, 2)),
        chronicConditions: randomItems(['Hypertension', 'Diabetes', 'Asthma'], randomInt(0, 2)),
        isActive: true,
        isVerified: true,
        profileImageUrl: defaultProfileImageUrl
      });
      
      patientsData.push({
        // user will be set after User.insertMany
        patientId: `P-${patientSeq.toString().padStart(6, '0')}-${uuidv4().slice(0, 8)}`,
        dateOfBirth: dob,
        gender,
        bloodType: patientUsersData[i].bloodGroup,
        phone: patientUsersData[i].phone,
  address: {
          street: address.street,
          city: address.city,
          district: address.district,
          province: address.province,
          country: 'Rwanda'
        },
        emergencyContact: patientUsersData[i].emergencyContact,
        allergies: patientUsersData[i].allergies,
        chronicConditions: patientUsersData[i].chronicConditions,
        primaryHospital: randomItem(hospitals)._id,
        isActive: true
      });
      
      patientSeq++;
    }
    
    // Bulk insert users
    console.log('\n   Inserting patient users in bulk...');
    process.stdout.write('   Progress: 0% - Inserting users...');
    const insertedPatientUsers = await User.insertMany(patientUsersData);
    patientUsers.push(...insertedPatientUsers);
    process.stdout.write('\r   Progress: 50% - Users inserted, linking to patients...\n');
    
    // Link users to patients
    for (let i = 0; i < insertedPatientUsers.length; i++) {
      patientsData[i].user = insertedPatientUsers[i]._id;
    }
    
    // Bulk insert patients
    console.log('   Inserting patients in bulk...');
    process.stdout.write('   Progress: 75% - Inserting patients...');
    const insertedPatients = await Patient.insertMany(patientsData);
    patients.push(...insertedPatients);
    process.stdout.write('\r   Progress: 100% - Patients inserted!\n');
    
    console.log(`✅ Created ${patients.length} patients`);
    
    // Sample patient for credentials display
    const samplePatient = patientUsers[0];

    // Patient profiles are already created above with the patients

    // --- APPOINTMENTS (≥900 appointments) ---
    const appointmentCount = randomInt(900, 1000);
    const appointments = [];
    
    console.log(`Creating ${appointmentCount} appointments...`);
    console.log(`Progress: 0% (0/${appointmentCount})`);
    
    // Create lookup maps for O(1) access instead of O(n) .find() operations
    const doctorUserMap = new Map();
    doctorUsers.forEach(du => {
      doctors.forEach(d => {
        if (d.user && d.user.toString() === du._id.toString()) {
          doctorUserMap.set(d._id.toString(), du);
        }
      });
    });
    
    const hospitalDeptMap = new Map();
    hospitals.forEach(h => {
      hospitalDeptMap.set(h._id.toString(), createdDepartments.filter(d => d.hospital.toString() === h._id.toString()));
    });
    
    for (let i = 0; i < appointmentCount; i++) {
      // Show progress every 50 appointments or at milestones
      if ((i + 1) % 50 === 0 || i === 0 || i === Math.floor(appointmentCount * 0.25) || i === Math.floor(appointmentCount * 0.5) || i === Math.floor(appointmentCount * 0.75) || i === appointmentCount - 1) {
        const progress = Math.round(((i + 1) / appointmentCount) * 100);
        process.stdout.write(`\rProgress: ${progress}% (${i + 1}/${appointmentCount}) - Preparing appointments...`);
      }
      
      const patient = randomItem(patientUsers);
      const doctor = randomItem(doctors);
      const doctorUser = doctorUserMap.get(doctor._id.toString()) || randomItem(doctorUsers);
      const hospital = randomItem(hospitals);
      const hospitalDepts = hospitalDeptMap.get(hospital._id.toString()) || createdDepartments;
      const department = randomItem(hospitalDepts);
      
      if (!doctorUser) continue;
      
      const appointmentDate = randomDate(new Date(2023, 0, 1), new Date());
      const appointmentTime = `${String(randomInt(8, 17)).padStart(2, '0')}:${randomItem(['00', '15', '30', '45'])}`;
      
      const patientName = `${patient.firstName} ${patient.lastName}`;
      const age = patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : randomInt(18, 80);
      
      appointments.push({
        patient: patient._id,
        doctor: doctorUser._id,
        hospital: hospital._id,
        department: department._id,
        appointmentType: randomItem(['virtual', 'in-person']),
        appointmentDate,
        appointmentTime,
        reasonForVisit: randomItem(['Regular checkup', 'Follow-up', 'Symptom evaluation', 'Consultation']),
        previousVisit: Math.random() > 0.5,
        insuranceInfo: {
          provider: patient.insurance?.insurerName || randomItem(insurance).name,
          policyNumber: patient.insurance?.policyNumber || `POL-${randomInt(100000, 999999)}`
        },
        patientDetails: {
          fullName: patientName,
          email: patient.email,
          phoneNumber: patient.phone,
          age,
          gender: patient.gender || randomItem(['Male', 'Female']),
          address: patient.address || 'Kigali, Rwanda',
          emergencyContact: patient.emergencyContact || {
            name: 'Emergency Contact',
            phone: randomPhone(),
            relationship: 'Relative'
          }
        },
        status: randomItem(['pending', 'confirmed', 'completed', 'cancelled', 'no-show']),
        consultationFee: randomInt(5000, 20000),
        paymentStatus: randomItem(['pending', 'paid', 'failed']),
        createdAt: randomDate(new Date(2023, 0, 1), appointmentDate)
      });
    }
    
    // Insert in one bulk operation
    console.log('\n   Inserting appointments in bulk...');
    process.stdout.write('   Progress: 100% - Inserting to database...');
    const createdAppointments = await Appointment.insertMany(appointments, { ordered: false });
    process.stdout.write('\r   Progress: 100% - Appointments inserted!\n');
    console.log(`✅ Created ${createdAppointments.length} appointments`);

    // --- PRESCRIPTIONS (≥800 prescriptions) ---
    const prescriptionCount = randomInt(800, 900);
    const prescriptions = [];
    
    console.log(`Creating ${prescriptionCount} prescriptions...`);
    console.log(`Progress: 0% (0/${prescriptionCount})`);
    
    // Create lookup maps for O(1) access
    const patientUserMap = new Map(patientUsers.map(pu => [pu._id.toString(), pu]));
    const doctorUserMapForPrescriptions = new Map(doctorUsers.map(du => [du._id.toString(), du]));
    
    const completedAppointments = createdAppointments.filter(a => a.status === 'completed');
    
    for (let i = 0; i < prescriptionCount; i++) {
      // Show progress every 50 prescriptions or at milestones
      if ((i + 1) % 50 === 0 || i === 0 || i === Math.floor(prescriptionCount * 0.25) || i === Math.floor(prescriptionCount * 0.5) || i === Math.floor(prescriptionCount * 0.75) || i === prescriptionCount - 1) {
        const progress = Math.round(((i + 1) / prescriptionCount) * 100);
        process.stdout.write(`\rProgress: ${progress}% (${i + 1}/${prescriptionCount}) - Preparing prescriptions...`);
      }
      const appointment = i < completedAppointments.length 
        ? completedAppointments[i] 
        : randomItem(createdAppointments);
      
      const patient = patientUserMap.get(appointment.patient.toString());
      const doctor = doctorUserMapForPrescriptions.get(appointment.doctor?.toString());
      
      if (!patient || !doctor) continue;
      
      const medicationCount = randomInt(1, 4);
      const medications = [];
      for (let j = 0; j < medicationCount; j++) {
        const med = randomItem(MEDICATIONS);
        medications.push({
          name: med,
          dosage: randomItem(['500mg', '250mg', '100mg', '50mg']),
          frequency: randomItem(['Once daily', 'Twice daily', 'Three times daily', 'Four times daily']),
          instructions: randomItem(['Take with food', 'Take on empty stomach', 'Take before bed', 'Take as needed'])
        });
      }
      
      prescriptions.push({
        prescriptionNumber: `PRES-${Date.now()}-${i}-${uuidv4().slice(0, 8)}`,
        patient: patient._id,
        doctor: doctor._id,
        appointment: appointment._id,
        diagnosis: randomItem(DIAGNOSES),
        medications,
        notes: 'Follow up if symptoms persist',
        datePrescribed: appointment.appointmentDate || new Date()
      });
    }
    
    // Insert in one bulk operation
    console.log('\n   Inserting prescriptions in bulk...');
    process.stdout.write('   Progress: 100% - Inserting to database...');
    const createdPrescriptions = await Prescription.insertMany(prescriptions, { ordered: false });
    process.stdout.write('\r   Progress: 100% - Prescriptions inserted!\n');
    console.log(`✅ Created ${createdPrescriptions.length} prescriptions`);
    
    // --- MEDICAL RECORDS (1,456+ medical records/tests to match stats) - Bulk insert ---
    const medicalRecordCount = 1456; // Exact number for stats
    const medicalRecords = [];
    
    console.log(`Creating ${medicalRecordCount} medical records using bulk operations...`);
    console.log(`Progress: 0% (0/${medicalRecordCount})`);
    
    // Create lookup maps for O(1) access
    const patientUserMapForRecords = new Map(patientUsers.map(pu => [pu._id.toString(), pu]));
    const doctorMapByUser = new Map();
    doctors.forEach(d => {
      if (d.user) {
        doctorMapByUser.set(d.user.toString(), d);
      }
    });
    
    // Prepare all medical records data first
    for (let i = 0; i < medicalRecordCount; i++) {
      // Show progress every 100 records or at milestones
      if ((i + 1) % 100 === 0 || i === 0 || i === Math.floor(medicalRecordCount * 0.25) || i === Math.floor(medicalRecordCount * 0.5) || i === Math.floor(medicalRecordCount * 0.75) || i === medicalRecordCount - 1) {
        const progress = Math.round(((i + 1) / medicalRecordCount) * 100);
        process.stdout.write(`\rProgress: ${progress}% (${i + 1}/${medicalRecordCount}) - Preparing medical records...`);
      }
      const appointment = randomItem(createdAppointments);
      const patient = patientUserMapForRecords.get(appointment.patient.toString());
      const doctor = appointment.doctor ? doctorMapByUser.get(appointment.doctor.toString()) : null;
      
      if (!patient || !doctor) {
        // If appointment doesn't have valid patient/doctor, create a simpler record
        const randomPatient = randomItem(patientUsers);
        const randomDoctor = randomItem(doctors);
        const randomHospital = randomItem(hospitals);
        
        medicalRecords.push({
        patient: randomPatient._id,
          doctor: randomDoctor._id,
        hospital: randomHospital._id,
          visitDate: randomDate(new Date(2023, 0, 1), new Date()),
          visitType: randomItem(['consultation', 'follow-up', 'emergency', 'routine-checkup', 'specialist-visit']),
          chiefComplaint: randomItem(['Headache', 'Fever', 'Cough', 'Abdominal pain', 'Chest pain', 'Fatigue']),
          symptoms: randomItems(['Fever', 'Cough', 'Headache', 'Nausea', 'Dizziness', 'Fatigue'], randomInt(1, 4)),
          vitalSigns: {
            temperature: parseFloat((36.5 + Math.random() * 2).toFixed(1)),
            bloodPressure: { systolic: randomInt(110, 140), diastolic: randomInt(70, 90) },
            heartRate: randomInt(60, 100),
            respiratoryRate: randomInt(12, 20),
            oxygenSaturation: randomInt(95, 100),
            weight: randomInt(50, 100),
            height: randomInt(150, 190),
            bmi: parseFloat((randomInt(18, 30) + Math.random()).toFixed(1))
          },
          physicalExamination: {
            general: 'Normal appearance',
            findings: randomItems(['Normal', 'Mild tenderness', 'Clear'], randomInt(1, 2))
          },
          diagnosis: {
            primary: randomItem(DIAGNOSES),
            secondary: randomItems(DIAGNOSES, randomInt(0, 2))
          },
          treatment: {
            medications: [{
              name: randomItem(MEDICATIONS),
              dosage: '500mg',
              frequency: 'Twice daily',
              duration: '7 days',
              instructions: 'Take with food'
            }]
          },
          allergies: randomPatient.allergies || [],
          notes: 'Patient responded well to treatment'
        });
        continue;
      }
      
      const visitDate = appointment.appointmentDate || randomDate(new Date(2023, 0, 1), new Date());
      
      medicalRecords.push({
        patient: patient._id,
        doctor: doctor._id,
        hospital: appointment.hospital,
        appointment: appointment._id,
        visitDate,
        visitType: randomItem(['consultation', 'follow-up', 'emergency', 'routine-checkup', 'specialist-visit']),
        chiefComplaint: randomItem(['Headache', 'Fever', 'Cough', 'Abdominal pain', 'Chest pain', 'Fatigue']),
        symptoms: randomItems(['Fever', 'Cough', 'Headache', 'Nausea', 'Dizziness', 'Fatigue'], randomInt(1, 4)),
        vitalSigns: {
          temperature: parseFloat((36.5 + Math.random() * 2).toFixed(1)),
          bloodPressure: {
            systolic: randomInt(110, 140),
            diastolic: randomInt(70, 90)
          },
          heartRate: randomInt(60, 100),
          respiratoryRate: randomInt(12, 20),
          oxygenSaturation: randomInt(95, 100),
          weight: randomInt(50, 100),
          height: randomInt(150, 190),
          bmi: parseFloat((randomInt(18, 30) + Math.random()).toFixed(1))
        },
        physicalExamination: {
          general: 'Normal appearance',
          findings: randomItems(['Normal', 'Mild tenderness', 'Clear'], randomInt(1, 2))
        },
        diagnosis: {
          primary: randomItem(DIAGNOSES),
          secondary: randomItems(DIAGNOSES, randomInt(0, 2))
        },
        treatment: {
          medications: [{
            name: randomItem(MEDICATIONS),
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '7 days',
            instructions: 'Take with food'
          }]
        },
        allergies: patient.allergies || [],
        notes: 'Patient responded well to treatment'
      });
    }
    
    // Insert in one bulk operation
    console.log('\n   Inserting medical records in bulk...');
    process.stdout.write('   Progress: 100% - Inserting to database...');
    const createdMedicalRecords = await MedicalRecord.insertMany(medicalRecords, { ordered: false });
    process.stdout.write('\r   Progress: 100% - Medical records inserted!\n');
    console.log(`✅ Created ${createdMedicalRecords.length} medical records`);
    
    // --- PHARMACIES (3-6 pharmacies) ---
    const pharmacyCount = randomInt(3, 6);
    const pharmacies = [];
    
    for (let i = 0; i < pharmacyCount; i++) {
      const name = `Pharmacy ${i + 1}`;
      const address = generateRwandanAddress();
      
      pharmacies.push({
        name,
        location: {
          address: address.street,
          city: address.city,
          district: address.district,
          coordinates: {
            latitude: -1.9 + Math.random() * 0.2,
            longitude: 30.0 + Math.random() * 0.3
          }
        },
        contact: {
          phone: randomPhone(),
          email: `pharmacy${i + 1}@example.rw`
        },
        operatingHours: {
          monday: { open: '08:00', close: '18:00', isOpen: true },
          tuesday: { open: '08:00', close: '18:00', isOpen: true },
          wednesday: { open: '08:00', close: '18:00', isOpen: true },
          thursday: { open: '08:00', close: '18:00', isOpen: true },
          friday: { open: '08:00', close: '18:00', isOpen: true },
          saturday: { open: '09:00', close: '14:00', isOpen: true },
          sunday: { open: '09:00', close: '14:00', isOpen: false }
        },
        services: randomItems(['Prescription Filling', 'Over-the-counter Medications', 'Medical Supplies', 'Health Consultations'], randomInt(2, 4)),
        insuranceAccepted: randomItems(insurance.map(i => i._id), randomInt(2, 4)),
        licenseNumber: `PHARM-${Date.now()}-${i + 1}`,
        rating: {
          average: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          count: randomInt(10, 50)
        },
        isActive: true,
        deliveryRadius: randomInt(5, 15),
        deliveryFee: randomInt(1000, 3000)
      });
    }
    
    const createdPharmacies = await Pharmacy.insertMany(pharmacies);
    console.log(`✅ Created ${createdPharmacies.length} pharmacies`);

    // --- CONSULTATION TYPES (at least 3) ---
    const consultTypes = await ConsultationType.insertMany([
      { name: 'General Consultation', category: 'General', fee: 5000, duration: 30, isActive: true },
      { name: 'Specialist Consultation', category: 'Specialist', speciality: 'Cardiology', fee: 15000, duration: 45, isActive: true },
      { name: 'Follow-up Consultation', category: 'General', fee: 3000, duration: 20, isActive: true },
      { name: 'Emergency Consultation', category: 'General', fee: 10000, duration: 60, isActive: true }
    ]);
    console.log(`✅ Created ${consultTypes.length} consultation types`);
    
    // --- ORDERS (optional) ---
    const orderCount = randomInt(200, 300);
    const orders = [];
    
    console.log(`Creating ${orderCount} orders...`);
    
    for (let i = 0; i < orderCount; i++) {
      const patient = randomItem(patientUsers);
      const pharmacy = randomItem(createdPharmacies);
      const prescription = i < createdPrescriptions.length ? createdPrescriptions[i] : null;
      
      const medicationCount = randomInt(1, 3);
      const medications = [];
      let totalAmount = 0;
      
      for (let j = 0; j < medicationCount; j++) {
        const med = randomItem(MEDICATIONS);
        const quantity = randomInt(1, 5);
        const unitPrice = randomInt(1000, 5000);
        const totalPrice = quantity * unitPrice;
        totalAmount += totalPrice;
        
        medications.push({
          name: med,
          quantity,
          unitPrice,
          totalPrice,
          dosage: '500mg',
          instructions: 'Take as directed'
        });
      }
      
      orders.push({
        patient: patient._id,
        pharmacy: pharmacy._id,
        prescription: prescription ? prescription._id : null,
        medications,
        orderType: prescription ? 'prescription' : 'over-the-counter',
        totalAmount,
        deliveryInfo: {
          type: randomItem(['pickup', 'delivery']),
          address: patient.address || 'Kigali, Rwanda',
          coordinates: {
            latitude: -1.9 + Math.random() * 0.2,
            longitude: 30.0 + Math.random() * 0.3
          },
          deliveryFee: Math.random() > 0.5 ? randomInt(1000, 3000) : 0
        },
        paymentInfo: {
          method: randomItem(['cash', 'mobile-money', 'bank-transfer', 'insurance']),
          insurance: Math.random() > 0.5 ? randomItem(insurance.map(i => i._id)) : null,
          insuranceCoverage: Math.random() > 0.5 ? randomInt(50, 90) : 0,
          amountToPay: totalAmount,
          status: randomItem(['pending', 'paid', 'failed'])
        },
        status: randomItem(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
      });
    }
    
    // Insert in one bulk operation
    console.log('   Inserting orders in bulk...');
    process.stdout.write('   Progress: 100% - Inserting to database...');
    const createdOrders = await Order.insertMany(orders, { ordered: false });
    process.stdout.write('\r   Progress: 100% - Orders inserted!\n');
    console.log(`✅ Created ${createdOrders.length} orders`);
    
    // --- TELECONSULTATIONS (optional) ---
    const teleconsultationCount = randomInt(150, 200);
    const teleconsultations = [];
    
    console.log(`Creating ${teleconsultationCount} teleconsultations...`);
    
    for (let i = 0; i < teleconsultationCount; i++) {
      const patient = randomItem(patientUsers);
      const hospital = randomItem(hospitals);
      const consultationType = randomItem(consultTypes);
      const insuranceProvider = Math.random() > 0.5 ? randomItem(insurance) : null;
      
      const scheduledDate = randomDate(new Date(2023, 0, 1), new Date());
      const patientName = `${patient.firstName} ${patient.lastName}`;
      const age = patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : randomInt(18, 80);
      
      teleconsultations.push({
        patient: patient._id,
        hospital: hospital._id,
        consultationType: consultationType._id,
        insurance: insuranceProvider ? insuranceProvider._id : null,
        patientDetails: {
          fullName: patientName,
          age,
          sex: patient.gender || randomItem(['Male', 'Female']),
          nationalId: patient.nationalId || `${randomInt(1, 999)}${randomInt(100000000, 999999999)}`,
          insuranceNumber: insuranceProvider ? `POL-${randomInt(100000, 999999)}` : null,
          phoneNumber: patient.phone
        },
        paymentDetails: {
          method: randomItem(['Bank Transfer', 'USSD', 'Out-of-Pocket']),
          amount: consultationType.fee || consultationType.baseFee || 5000,
          status: randomItem(['Pending', 'Paid', 'Failed'])
        },
        consultation: {
          type: randomItem(['Video Call', 'Phone Call']),
          scheduledDate,
          status: randomItem(['Scheduled', 'In Progress', 'Completed', 'Cancelled'])
        }
      });
    }
    
    // Insert in one bulk operation
    console.log('   Inserting teleconsultations in bulk...');
    process.stdout.write('   Progress: 100% - Inserting to database...');
    const createdTeleconsultations = await Teleconsultation.insertMany(teleconsultations, { ordered: false });
    process.stdout.write('\r   Progress: 100% - Teleconsultations inserted!\n');
    console.log(`✅ Created ${createdTeleconsultations.length} teleconsultations`);
    
    // --- EMERGENCIES (optional) ---
    const emergencyCount = randomInt(100, 150);
    const emergencies = [];
    
    console.log(`Creating ${emergencyCount} emergencies...`);
    
    for (let i = 0; i < emergencyCount; i++) {
      const patient = randomItem(patientUsers);
      const address = generateRwandanAddress();
      
      emergencies.push({
        patient: patient._id,
        emergencyType: randomItem(['medical', 'accident', 'maternal', 'respiratory', 'mental-health', 'covid', 'cardiac', 'trauma', 'poisoning', 'allergic-reaction']),
        severity: randomItem(['mild', 'moderate', 'severe', 'critical']),
        quickCareType: randomItem(['ambulance', 'doctor-on-call', 'nurse-on-call', 'medication-delivery', 'telemedicine']),
        location: {
          address: address.street,
          coordinates: {
            latitude: -1.9 + Math.random() * 0.2,
            longitude: 30.0 + Math.random() * 0.3
          },
          landmark: `Near ${randomItem(['Market', 'School', 'Church', 'Hospital'])}`
        },
        description: randomItem(['Patient experiencing severe symptoms', 'Accident on the road', 'Medical emergency', 'Need immediate assistance']),
        symptoms: randomItems(['Pain', 'Fever', 'Dizziness', 'Shortness of breath', 'Nausea'], randomInt(1, 3)),
        contactInfo: {
          primaryPhone: patient.phone,
          emergencyContact: patient.emergencyContact || {
            name: 'Emergency Contact',
            phone: randomPhone(),
            relationship: 'Relative'
          }
        },
        assignedTo: {
          hospital: Math.random() > 0.5 ? randomItem(hospitals)._id : null,
          estimatedArrival: randomDate(new Date(), new Date(Date.now() + 3600000))
        },
        status: randomItem(['pending', 'acknowledged', 'help-on-way', 'on-scene', 'resolved', 'cancelled'])
      });
    }
    
    // Insert in one bulk operation
    console.log('   Inserting emergencies in bulk...');
    process.stdout.write('   Progress: 100% - Inserting to database...');
    const createdEmergencies = await Emergency.insertMany(emergencies, { ordered: false });
    process.stdout.write('\r   Progress: 100% - Emergencies inserted!\n');
    console.log(`✅ Created ${createdEmergencies.length} emergencies`);

    // ========================================================================
    // SUMMARY AND CREDENTIALS
    // ========================================================================
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 SEEDING SUMMARY');
    console.log('='.repeat(70));
    console.log(`\n✅ Successfully created:\n`);
    console.log(`   Hospitals:          ${hospitals.length}`);
    console.log(`   Departments:        ${createdDepartments.length}`);
    console.log(`   Insurance Providers: ${insurance.length}`);
    console.log(`   Consultation Types:  ${consultTypes.length}`);
    console.log(`   Admin Users:        ${adminUsers.length}`);
    console.log(`   Doctors:            ${doctors.length}`);
    console.log(`   Patients:           ${patients.length}`);
    console.log(`   Appointments:       ${createdAppointments.length}`);
    console.log(`   Prescriptions:      ${createdPrescriptions.length}`);
    console.log(`   Medical Records:    ${createdMedicalRecords.length}`);
    console.log(`   Pharmacies:         ${createdPharmacies.length}`);
    console.log(`   Orders:             ${createdOrders.length}`);
    console.log(`   Teleconsultations:  ${createdTeleconsultations.length}`);
    console.log(`   Emergencies:        ${createdEmergencies.length}`);
    
    console.log('\n' + '='.repeat(70));
    console.log('🔐 SAMPLE CREDENTIALS - USE THESE TO LOGIN');
    console.log('='.repeat(70));
    
    console.log('\n👑 PLATFORM ADMIN:');
    console.log(`   Email:    ${platformAdmin.email}`);
    console.log(`   Password: Admin#123`);
    console.log(`   Role:     Admin`);
    console.log(`   Name:     ${platformAdmin.firstName} ${platformAdmin.lastName}`);
    
    console.log('\n🏥 SAMPLE HOSPITAL ADMIN:');
    const sampleHospitalAdmin = hospitalAdmins[0];
    const sampleAdminHospital = hospitals[0];
    console.log(`   Hospital: ${sampleAdminHospital.name}`);
    console.log(`   Email:    ${sampleHospitalAdmin.email}`);
    console.log(`   Password: Admin#123`);
    console.log(`   Role:     Hospital Admin`);
    console.log(`   Name:     ${sampleHospitalAdmin.firstName} ${sampleHospitalAdmin.lastName}`);
    console.log(`   Location: ${sampleAdminHospital.location}`);
    
    console.log('\n👨‍⚕️ SAMPLE DOCTOR:');
    const sampleDoctorModel = doctors.find(d => d.user.toString() === sampleDoctor._id.toString());
    const sampleDoctorHospital = hospitals.find(h => h._id.toString() === sampleDoctorModel?.hospital?.toString());
    const sampleDoctorDept = createdDepartments.find(d => d._id.toString() === sampleDoctorModel?.department?.toString());
    console.log(`   Email:        ${sampleDoctor.email}`);
    console.log(`   Password:     Doctor#123`);
    console.log(`   Role:         Doctor`);
    console.log(`   Name:         ${sampleDoctor.firstName} ${sampleDoctor.lastName}`);
    console.log(`   Hospital:     ${sampleDoctorHospital?.name || 'N/A'}`);
    console.log(`   Department:   ${sampleDoctorDept?.name || 'N/A'}`);
    console.log(`   Specialization: ${sampleDoctorModel?.specialization || 'N/A'}`);
    console.log(`   License:      ${sampleDoctorModel?.licenseNumber || 'N/A'}`);
    
    console.log('\n👥 SAMPLE PATIENT:');
    const samplePatientModel = patients.find(p => p.user.toString() === samplePatient._id.toString());
    const samplePatientHospital = hospitals.find(h => h._id.toString() === samplePatientModel?.primaryHospital?.toString());
    console.log(`   Email:        ${samplePatient.email}`);
    console.log(`   Password:     Patient#123`);
    console.log(`   Role:         Patient`);
    console.log(`   Name:         ${samplePatient.firstName} ${samplePatient.lastName}`);
    console.log(`   Patient ID:   ${samplePatientModel?.patientId || 'N/A'}`);
    console.log(`   Phone:        ${samplePatient.phone}`);
    console.log(`   Primary Hospital: ${samplePatientHospital?.name || 'N/A'}`);
    console.log(`   Insurance:    ${samplePatient.insurance?.insurerName || 'N/A'}`);
    
    console.log('\n' + '='.repeat(70));
    console.log('📋 CREDENTIALS SUMMARY');
    console.log('='.repeat(70));
    console.log('\n🔑 Default Password Pattern:');
    console.log('   - Platform Admin: Admin#123');
    console.log('   - Hospital Admins: Admin#123');
    console.log('   - All Doctors: Doctor#123');
    console.log('   - All Patients: Patient#123');
    
    console.log('\n📝 Note:');
    console.log('   - All users have unique Rwandan names');
    console.log('   - All emails use @gmail.com format');
    console.log('   - Email format: firstnamelastname@gmail.com (or with number for uniqueness)');
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Seed completed successfully!');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Error during seeding:');
    console.error(error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  }
}

// Run the seeder
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✨ Seeding process finished\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seed };
