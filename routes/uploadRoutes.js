const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure Multer for file uploads
// You might want to configure storage destination (e.g., Cloudinary, local disk) here
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Temporary local storage for now
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// @desc    Upload image
// @route   POST /api/upload/image
// @access  Private
router.post('/image', protect, upload.single('image'), uploadController.uploadImage);

module.exports = router;








