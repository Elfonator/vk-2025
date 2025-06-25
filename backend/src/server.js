const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const cors = require('cors');

const { getFileList, fileFilter } = require('./upload');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/uploads';
const ALLOWED_TYPES = (process.env.ALLOWED_TYPES || 'image/png,image/jpeg').split(',');

app.use(cors());

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({
    storage,
    fileFilter: fileFilter(ALLOWED_TYPES),
});

app.get('/health', (_req, res) => {
    res.send('OK');
});

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    res.json({ message: 'File uploaded', filename: req.file.filename });
});

app.get('/images', (_req, res) => {
    const files = getFileList(UPLOAD_DIR);
    res.json(files);
});

// Serve uploaded files statically
app.use('/uploads', express.static(process.env.UPLOAD_DIR));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});