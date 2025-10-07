import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/distance/:origin/:destination/:mode - Alternative endpoint with path parameters
router.get('/:origin/:destination/:mode', async (req, res) => {
    try {
        const { origin, destination, mode } = req.params;
        const decodedOrigin = decodeURIComponent(origin);
        const decodedDestination = decodeURIComponent(destination);
        
        console.log('🚗 Calculating distance from:', decodedOrigin, 'to:', decodedDestination, 'mode:', mode);
        console.log('🔑 Using Google Maps API key:', process.env.GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing');
        
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins: decodedOrigin,
                destinations: decodedDestination,
                mode: mode,
                units: 'metric',
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        console.log('✅ Distance calculated successfully');
        res.json(response.data);
    } catch (error) {
        console.error('❌ Error calculating distance:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
            res.status(error.response.status).json({ 
                error: 'Failed to calculate distance',
                details: error.response.data 
            });
        } else {
            res.status(500).json({ error: 'Failed to calculate distance' });
        }
    }
});

export default router;

