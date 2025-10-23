import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/distance/:origin/:destination/:mode - Alternative endpoint with path parameters
router.get('/:origin/:destination/:mode', async (req, res) => {
    try {
        const { origin, destination, mode } = req.params;
        const decodedOrigin = decodeURIComponent(origin);
        const decodedDestination = decodeURIComponent(destination);
        
        const response = await axios.post('https://routes.googleapis.com/directions/v2:computeRoutes', 
            {
                origin: {
                    "address": decodedOrigin,
                },
                destination: {
                    "address":decodedDestination
                },
                travelMode: mode,
                units: 'metric',
            },
            {
                headers: {
                    'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
                    'X-Goog-FieldMask':"routes.distanceMeters,routes.duration"
                }
            }
        );

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

