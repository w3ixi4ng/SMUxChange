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

// by course area
router.get('/getByCourseArea/:course_area', async(req,res) => {
    try {
        const { course_area } = req.params;
        const ref = await db.collection(course_area).get();
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

export default router;

