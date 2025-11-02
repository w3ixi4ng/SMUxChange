import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import route files
import photoRoutes from './routes/api_functions/photos.js';
import eventsRoutes from './routes/api_functions/events.js';
import distanceRoutes from './routes/api_functions/distance.js';
import databaseRoutes from './routes/database_functions/database.js';
import apartmentRoutes from './routes/api_functions/apartment.js';
import qrCodeRoutes from './routes/api_functions/qrCode.js';


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
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.static(path.join(__dirname, '../'))); // Serve files from parent directory

// Use route files
app.use('/api/photos', photoRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/distance', distanceRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/database', databaseRoutes);
app.use('/api/qrCode', qrCodeRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
