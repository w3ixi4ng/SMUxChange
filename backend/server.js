import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import route files
import eventsRoutes from './routes/api_functions/events.js';
import distanceRoutes from './routes/api_functions/distance.js';
import databaseRoutes from './routes/database_functions/database.js';
import apartmentRoutes from './routes/api_functions/apartment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Debug: Check if API keys are loaded
console.log('🔑 SERPAPI_API_KEY loaded:', process.env.SERPAPI_API_KEY ? 'Yes' : 'No');
console.log('🗺️ GOOGLE_MAPS_API_KEY loaded:', process.env.GOOGLE_MAPS_API_KEY ? 'Yes' : 'No');

const app = express();
const PORT = process.env.PORT;


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve files from parent directory

// Use route files
app.use('/api/events', eventsRoutes);
app.use('/api/distance', distanceRoutes);
app.use('/database', databaseRoutes);
app.use('/apartments', apartmentRoutes);

// Serve school_info.html
app.get('/school-info', (req, res) => {
    res.sendFile(path.join(__dirname, 'school_info.html'));
});

// Serve school_info.js as a static file
app.get('/school_info.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'school_info.js'));
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📚 School info page: http://localhost:${PORT}/school-info`);
    console.log(`🌐 Main page: http://localhost:${PORT}/`);
});
