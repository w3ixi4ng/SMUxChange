import express from 'express';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.DATABASE_KEY);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password
        });
        res.json({ success: true, user: userRecord });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

export default router;