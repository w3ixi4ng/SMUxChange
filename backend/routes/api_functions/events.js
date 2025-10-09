import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/events/:city/:country - Fetch events for a specific city and country
router.get('/:city/:country', async (req, res) => {
    try {
        const { city, country } = req.params;

        
        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                engine: 'google_events',
                q: `events in ${city}, ${country}`,
                location: `${city}, ${country}`,
                api_key: process.env.SERPAPI_API_KEY
            }
        });

        console.log('✅ Events fetched successfully for:', city);
        res.json(response.data);
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

