const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const port = 80;

//connect to PostgreSQL
const db = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect(undefined)
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error('DB connection error:', err.message));

// Endpoint
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});