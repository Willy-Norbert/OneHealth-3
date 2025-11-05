# Database Seeding Instructions

## Quick Start

### 1. Set MongoDB Connection String

Create a `.env` file in the root directory (or set environment variable):

```bash
MONGO_URI=mongodb://localhost:27017/onehealth
```

Or for MongoDB Atlas:
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/onehealth
```

### 2. Run the Seeder

```bash
node seed.rw.js
```

Or if you prefer npm:
```bash
npm run seed
```

(Add this to package.json scripts if needed: `"seed": "node seed.rw.js"`)

## What Gets Created

The seeder will create:

- **2 Hospitals**: Baho Hospital & Kalisimbi Hospital
- **8-12 Departments** across both hospitals
- **3-5 Insurance Providers** (Mutuelle de Santé, RSSB, Radiant, Sanlam)
- **100-140 Doctors** with full profiles
- **750-850 Patients** with User accounts
- **900-1000 Appointments**
- **800-900 Prescriptions**
- **300-400 Medical Records**
- **3-6 Pharmacies**
- **3+ Consultation Types**
- Plus: Orders, Teleconsultations, Emergencies

## Test Credentials

After running the seeder, you'll see credentials displayed in the console:

### Platform Admin
- **Email**: admin@onehealth.rw
- **Password**: Admin#123

### Hospital Admins
- **Baho Hospital**: admin@bahohospital.rw
- **Kalisimbi Hospital**: admin@kalisimbihospital.rw
- **Password**: Admin#123

### Sample Doctor
- **Email**: doctor1@hospital.rw
- **Password**: Doctor#123
- All doctors use: Doctor#123

### Sample Patient
- **Email**: patient1@example.rw
- **Password**: Patient#123
- All patients use: Patient#123

## Important Notes

⚠️ **This is synthetic test data only** - No real patient information is used.

⚠️ **The seeder will DELETE all existing data** before seeding. Make sure you're using a test/development database.

## Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB is running and MONGO_URI is correct.

### Duplicate Key Error
```
E11000 duplicate key error
```
**Solution**: The seeder clears existing data first. If this persists, manually drop the database:
```bash
mongosh
use onehealth
db.dropDatabase()
```

### Memory Issues
If seeding fails due to memory, reduce BATCH_SIZE in seed.rw.js:
```javascript
const BATCH_SIZE = 250; // Instead of 500
```

## Verification

After seeding, verify the data:

```bash
# Connect to MongoDB
mongosh

# Use the database
use onehealth

# Check counts
db.users.countDocuments({ role: 'patient' })
db.users.countDocuments({ role: 'doctor' })
db.appointments.countDocuments()
db.prescriptions.countDocuments()
```

## Re-seeding

To re-seed the database, simply run the seeder again:
```bash
node seed.rw.js
```

The script will automatically clear existing data before seeding new data.

