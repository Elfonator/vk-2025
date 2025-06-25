const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const { getFileList, fileFilter } = require('./upload');

const app = express();
const PORT = process.env.PORT || 3000;
const INPUT_DIR = process.env.INPUT_DIR || '/input';
const OUTPUT_DIR = process.env.OUTPUT_DIR || '/output';
const ALLOWED_TYPES = (process.env.ALLOWED_TYPES || 'text/plain,text/csv,application/json').split(',');

app.use(cors());
app.use(express.json());

// Ensure input and output directories exist
[INPUT_DIR, OUTPUT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer setup
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, INPUT_DIR),
    filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage, fileFilter: fileFilter(ALLOWED_TYPES) });

app.get('/health', (_req, res) => res.send('OK'));

app.get('/results', (_req, res) => {
    const files = getFileList(OUTPUT_DIR).filter(f => f.endsWith('.result.txt'));
    res.json(files);
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    res.json({ message: 'File uploaded', filename: req.file.filename });
});

app.post('/process', (_req, res) => {
    const files = getFileList(INPUT_DIR);
    const inputFile = files.find(f => f.endsWith('.txt') || f.endsWith('.csv') || f.endsWith('.json'));

    if (!inputFile) return res.status(400).send('No input file found.');

    const inputPath = path.join(INPUT_DIR, inputFile);
    const outputPath = path.join(OUTPUT_DIR, inputFile + '.result.txt');

    fs.readFile(inputPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Failed to read input.');

        const lines = data.split('\n').length;
        const result = `File: ${inputFile}\nLine count: ${lines}\n`;

        fs.writeFile(outputPath, result, err => {
            if (err) return res.status(500).send('Failed to write output.');
            res.send(`Processed ${inputFile}. Output saved as ${path.basename(outputPath)}`);
        });
    });
});

app.use('/output', express.static(OUTPUT_DIR));

app.listen(PORT, () => {
    console.log(`File processor running on port ${PORT}`);
});
