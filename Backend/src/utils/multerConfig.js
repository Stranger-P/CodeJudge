const multer = require('multer');
const path = require('path');

// Store file in memory
const storage = multer.memoryStorage();

// Allow both .txt and .json files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['text/plain', 'application/json'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .txt and .json files are allowed'), false);
  }
};

// 20 MB limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

module.exports = upload;
