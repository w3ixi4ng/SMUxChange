import express from 'express';
import axios from 'axios';

const router = express.Router();


router.get('/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const decodedquery= decodeURIComponent(query);
        
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                "query": `apartments near ${decodedquery}`,
                "type": "lodging",
                "key":process.env.GOOGLE_MAPS_API_KEY
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

