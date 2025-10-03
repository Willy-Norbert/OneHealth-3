const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2; // Ensure you require the v2 object
const fs = require('fs'); // Import fs module

// TEMPORARY: Hardcode Cloudinary config for aggressive debugging
cloudinary.config({
  cloud_name: 'dn9msxmaf',
  api_key: '883334881435652',
  api_secret: 'eHD9saTg_K3RwsTaVdmh8Lcg6-w',
});

console.log('Upload Controller - Cloudinary configured directly. Uploader available:', !!cloudinary.uploader);

// Configure Multer for file uploads
const multer = require('multer');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
// @access  Private
exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'onehealth', // Specify a folder in Cloudinary
    });

    // Remove the temporary file from local storage after successful upload
    fs.unlinkSync(req.file.path); // Delete the temporary file

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500);
    throw new Error('Failed to upload image to Cloudinary');
  }
});
