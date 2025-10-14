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
        // Use Firebase Admin to verify the user
        const userRecord = await admin.auth().getUserByEmail(email);
        // You'll need to implement password verification differently
        // since Firebase Admin doesn't have signInWithEmailAndPassword
        res.json({ success: true, user: userRecord });
    } catch (error) {   
        console.log(error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

export default router;