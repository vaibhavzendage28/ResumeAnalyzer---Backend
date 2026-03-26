const multer = require('multer');

// Configure multer storage (you can customize this as needed)

const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory (you can also configure disk storage)
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        // Accept only PDF files
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
     } 
})

module.exports = upload;