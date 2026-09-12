require('dotenv').config();
const path = require('node:path');
const express = require('express');
const cors = require('cors');

require('./db'); // ensures schema + seed run on boot

const authRoutes = require('./routes/auth');
const caregiverRoutes = require('./routes/caregiver');
const patientRoutes = require('./routes/patient');

const app = express();

app.use(cors());
app.use(express.json());

// Locally-stored memory/family-member photos (see middleware/upload.js) —
// served as plain static files. Only the DB-stored relative path
// (/uploads/memories/<generated-filename>) is ever trusted, never the
// caller's original filename.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/patient', patientRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`SMRITI backend listening on http://localhost:${PORT}`);
});
