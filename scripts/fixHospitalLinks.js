const mongoose = require('mongoose');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

/**
 * Migration script to fix hospital-user linking issues
 * Run this after deploying the schema changes
 */
async function fixHospitalLinks() {
  try {
    console.log('🔄 Starting hospital link migration...');
    
    // Find all hospital-role users without a hospital reference
    const hospitalUsers = await User.find({ 
      role: 'hospital',
      $or: [
        { hospital: null },
        { hospital: { $exists: false } }
      ]
    });
    
    console.log(`📋 Found ${hospitalUsers.length} hospital users without hospital links`);
    
    for (const user of hospitalUsers) {
      console.log(`🔍 Processing user: ${user.email} (${user._id})`);
      
      // Find hospital with this userId
      const hospital = await Hospital.findOne({ userId: user._id });
      
      if (hospital) {
        // Update user's hospital field
        await User.findByIdAndUpdate(user._id, { hospital: hospital._id });
        console.log(`✅ Linked user ${user.email} to hospital ${hospital.name}`);
      } else {
        console.log(`⚠️ No hospital found for user ${user.email}`);
      }
    }
    
    // Find hospitals without userId but created by hospital users
    const orphanHospitals = await Hospital.find({
      $or: [
        { userId: null },
        { userId: { $exists: false } }
      ]
    });
    
    console.log(`📋 Found ${orphanHospitals.length} hospitals without user links`);
    
    for (const hospital of orphanHospitals) {
      // Try to find a hospital-role user with this hospital reference
      const user = await User.findOne({ 
        role: 'hospital',
        hospital: hospital._id 
      });
      
      if (user) {
        // Update hospital's userId field
        await Hospital.findByIdAndUpdate(hospital._id, { userId: user._id });
        console.log(`✅ Linked hospital ${hospital.name} to user ${user.email}`);
      } else {
        console.log(`⚠️ No user found for hospital ${hospital.name}`);
      }
    }
    
    console.log('✅ Hospital link migration completed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://wiseacademy:01402@cluster0.bsxehn0.mongodb.net/onehealth?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
      console.log('📦 Connected to MongoDB');
      return fixHospitalLinks();
    })
    .then(() => {
      console.log('🎉 Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { fixHospitalLinks };