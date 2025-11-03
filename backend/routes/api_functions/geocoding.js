import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const decodedadress = decodeURIComponent(address);
        
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', 
            {
                params: {
                    "address": decodedadress,
                    "key": process.env.GOOGLE_MAPS_API_KEY
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