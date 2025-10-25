import express from 'express';
import axios from 'axios';
import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
const router = express.Router();


dotenv.config();

const serviceAccount = JSON.parse(process.env.DATABASE_KEY);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// all exchange schools
router.get('/getAllExchangeSchools', async (req, res) => {
    try {
        const ref = await db.collection("Exchange School Info").get();
        let records = [];
        // Loop through documents
        ref.forEach(doc => {
            records.push(doc.data());
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
});

// get school by country
router.get('/getAllExchangeSchoolsByCountry/:country', async (req, res) => {
    try {
        const { country } = req.params;
        const ref = await db.collection("Exchange School Info").where("country", "==", country).get();
        let records = [];
        // Loop through documents
        ref.forEach(doc => {
            records.push(doc.data());
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
});


// get school by university name
router.get('/getSchool/:university', async (req, res) => {
    try {
        const { university } = req.params;
        const ref = await db.collection("Exchange School Info").where("host_university", "==", university).get();
        let records = [];
        // Loop through documents
        ref.forEach(doc => {
            records.push(doc.data());
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
});


// get all faculty
router.get('/getAllFaculty', async(req,res) => {
    try {
        const ref = await db.collection("Faculty Info").get();
        let records = [];
        // Loop through documents
        ref.forEach(doc => {
            records.push(doc.data());
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
})

// get tracks by faculty name
router.get('/getTracksByMajor/:faculty_name', async(req,res) => {
    try {
        const { faculty_name } = req.params;
        const ref = await db.collection("Faculty Info").where("Faculty_Name","==", faculty_name).get();
        let records = [];
        // Loop through documents
        ref.forEach(doc => {
            records.push(doc.data());
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
})

//get by course
router.get('/getFaculty/:facultyname', async(req,res) => {
    try {
        const { facultyname} = req.params;
        const ref = await db.collection("Faculty Info").where("Faculty_Name","==", facultyname).get();
        let records = [];
        // Loop through documents
        ref.forEach(doc => {
            records.push(doc.data());
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
})

router.get('/getAllCourseAreas', async(req,res) => {
    try {
        const ref = await db.collection("Course Areas").get();
        let records = [];
        // Loop through documents
        ref.forEach(doc => {
            records.push(doc.data());
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
})


// by course area then university
router.get('/getByCourseAreaAndUniversity/:course_area/:university', async(req,res) => {
    try {
        const { course_area, university } = req.params;
        const ref = await db.collection(course_area).where("Host University", "==", university).get();
        let records = [];
        // Loop through documents
        ref.forEach(doc => {
            records.push(doc.data());
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
})

// by course area then country
router.get('/getByCourseAreaAndCountry/:course_area/:country', async(req,res) => {
    try {
        const { course_area, country } = req.params;
        const ref = await db.collection(course_area).where("Country", "==", country).get();
        let records = [];
        // Loop through documents
        ref.forEach(doc => {
            records.push(doc.data());
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
})

router.get('/getUser/:uid', async(req,res) => {
    try {
        const { uid } = req.params;
        const ref = await db.collection("users").where("uid", "==", uid).get();
        let records = [];
        ref.forEach(doc => {
            records.push(doc.data());
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
})

router.post('/saveProfile', async(req,res) => {
    try {
        const { uid, name, faculty, major, track, secondMajor } = req.body;
        
        // Set document with uid as the document ID
        await db.collection('users').doc(uid).set({
            uid: uid,
            name: name,
            faculty: faculty,
            major: major,
            track: track,
            secondMajor: secondMajor
        });

        res.json({ message: "Profile saved successfully" });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ error: 'Failed to save profile' });
    }
})


router.get('/getProfile/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        
        const doc = await db.collection('users').doc(uid).get();
        
        if (doc.exists) {
            res.json(doc.data());
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

export default router;

router.post('/saveMap', async(req,res) => {
    try {
        const { country, university, faculty, major, track, secondMajor, map } = req.body;
        await db.collection('users').doc(uid).collection('maps').add({
            country: country,
            university: university,
            faculty: faculty,
            major: major,
            track: track,
            secondMajor: secondMajor,
            map: map
        });
    } catch(err) {
        console.log(err);
    }
})