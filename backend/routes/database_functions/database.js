import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/events/:city/:country - Fetch events for a specific city and country
router.get('/:school', async (req, res) => {
    try {
        const {school} = req.params;
    } catch(err) {
        console.log(err);
    }
});

router.get('/:basket/:school', async(req,res) => {
    try {
        const {basket,school} = req.params;
    } catch(err) {
        console.log(err);
    }
})


export default router;

