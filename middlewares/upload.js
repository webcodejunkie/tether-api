// Require Multer to upload single photo to MongoDB
const multer = require('multer');
const path = require('path');

// Function to process File
const storage = multer.diskStorage({
  // Upload to destination /uploads/
  destination: (req, file, cb) => {
    cb(null, '/uploads/');
  },
  // Assign Filename
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({ storage: storage });

module.exports = upload;
