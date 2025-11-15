// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = file.fieldname === 'photo' ? 'uploads/photos' : 'uploads/items';
//     // Ensure the folder exists
//     fs.mkdirSync(folder, { recursive: true });
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (!file) {
//       return cb(null, false); // Skip if no file provided (optional)
//     }
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(path.extname(file.originalname || '').toLowerCase());
//     const mimetype = filetypes.test(file.mimetype || '');
//     if (extname && mimetype) {
//       return cb(null, true);
//     }
//     cb(new Error('Only JPEG/PNG images allowed'));
//   },
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// module.exports = { upload };


const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'image' ? 'uploads/images' : 'uploads/items'; // Change to 'image'
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(null, false); // Skip if no file provided (optional)
    }
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname || '').toLowerCase());
    const mimetype = filetypes.test(file.mimetype || '');
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG/PNG images allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = { upload };