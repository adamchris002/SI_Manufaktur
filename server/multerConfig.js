const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure destination and filename for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory recursively if it doesn't exist
    }
    cb(null, uploadDir); // Set the destination folder where files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalExtension = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, originalExtension);
    cb(null, `${fileName}-${uniqueSuffix}${originalExtension}`); // Generate a unique filename
  }
});

// Initialize multer instance with the configured storage options
const upload = multer({ storage: storage });

module.exports = upload;
