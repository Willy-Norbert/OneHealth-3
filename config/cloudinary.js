const cloudinary = require('cloudinary').v2;

console.log('Cloudinary Config - CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Cloudinary Config - CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('Cloudinary Config - CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dn9msxmaf',
  api_key: process.env.CLOUDINARY_API_KEY || '883334881435652',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'eHD9saTg_K3RwsTaVdmh8Lcg6-w',
});

console.log('Cloudinary Config - Exported cloudinary.v2 object:', JSON.stringify(cloudinary.v2, null, 2));
module.exports = cloudinary.v2; // Ensure the configured cloudinary.v2 object is exported






