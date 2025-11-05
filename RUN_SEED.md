# 🚀 Quick Start: Run Database Seeder

## Step 1: Set MongoDB Connection

Make sure your `.env` file has:
```bash
MONGO_URI=mongodb://localhost:27017/onehealth
```

Or set it directly:
```bash
set MONGO_URI=mongodb://localhost:27017/onehealth
```

## Step 2: Run the Seeder

### Option 1: Using npm script
```bash
npm run seed
```

### Option 2: Direct node command
```bash
node seed.rw.js
```

## Step 3: View Credentials

After the seeder completes, you'll see a credentials section in the console output like this:

```
======================================================================
🔐 TEST CREDENTIALS - USE THESE TO LOGIN
======================================================================

👑 PLATFORM ADMIN:
   Email:    admin@onehealth.rw
   Password: Admin#123
   Role:     Admin
   Name:     Admin User

🏥 HOSPITAL ADMINS:

   Hospital 1: Baho Hospital
   Email:    admin@bahohospital.rw
   Password: Admin#123
   Role:     Hospital Admin
   Name:     [Rwandan Name]
   Hospital: Baho Hospital
   Location: Kigali, Gasabo District

   Hospital 2: Kalisimbi Hospital
   Email:    admin@kalisimbihospital.rw
   Password: Admin#123
   Role:     Hospital Admin
   Name:     [Rwandan Name]
   Hospital: Kalisimbi Hospital
   Location: Rubavu District, Western Province

👨‍⚕️ SAMPLE DOCTOR:
   Email:        doctor1@hospital.rw
   Password:     Doctor#123
   Role:         Doctor
   Name:         [Rwandan Name]
   Hospital:     Baho Hospital
   Department:   Cardiology
   Specialization: Cardiology
   License:      LIC-[number]

👥 SAMPLE PATIENT:
   Email:        patient1@example.rw
   Password:     Patient#123
   Role:         Patient
   Name:         [Rwandan Name]
   Patient ID:   P-000001-[code]
   Phone:        +250788123456
   Primary Hospital: Baho Hospital
   Insurance:    Mutuelle de Santé
```

## Default Passwords

All users follow these patterns:

- **Platform Admin**: `Admin#123`
- **Hospital Admins**: `Admin#123`
- **All Doctors**: `Doctor#123`
- **All Patients**: `Patient#123`

## Email Patterns

- **Doctors**: `doctor1@hospital.rw`, `doctor2@hospital.rw`, etc.
- **Patients**: `patient1@example.rw`, `patient2@example.rw`, etc.

## What Gets Created

✅ 2 Hospitals (Baho Hospital & Kalisimbi Hospital)  
✅ 8-12 Departments  
✅ 100-140 Doctors  
✅ 750-850 Patients  
✅ 900-1000 Appointments  
✅ 800-900 Prescriptions  
✅ 300-400 Medical Records  
✅ 3-6 Pharmacies  
✅ Plus: Orders, Teleconsultations, Emergencies

## Troubleshooting

**Connection Error?**
- Make sure MongoDB is running
- Check MONGO_URI is correct

**Want to re-seed?**
- Just run `npm run seed` again - it clears old data first

