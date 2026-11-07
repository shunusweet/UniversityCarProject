const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image, PDF, or Word files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
