import express from 'express';
import axios from 'axios';

const router = express.Router();


router.get('/:photo', async (req, res) => {
    try {
        const { photo } = req.params;
        const decodedphoto= decodeURIComponent(photo);
        
        const response = await axios.get('https://places.googleapis.com/v1', {
            params: {
                "NAME": decodedphoto,
                "API_KEY": process.env.GOOGLE_MAPS_API_KEY,
                "maxHeightpx": "40px"
            }
        });

        res.json(response.data.results);
    } catch (error) {
        console.error('❌ Error fetching events:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
            res.status(error.response.status).json({ 
                error: 'Failed to fetch events',
                details: error.response.data 
            });
        } else {
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    }
});

export default router;

