import express from 'express';
import QRCode from 'qrcode';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
    const { map } = req.body;
    const encodedMap = encodeURIComponent(JSON.stringify(map));
    const url = `https//smuxchange.vercel.app/shareMap?map=${encodedMap}`;
        const qrCode = await QRCode.toDataURL(url, { width: 700 });
        res.json({ qrCode, url });
    } catch (error) {
        console.error('❌ Error generating QR code:', error.message);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

export default router;