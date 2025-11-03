import express from 'express';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
const router = express.Router();
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
        const { uid, name, faculty, major, track, secondMajor, avatarUrl } = req.body;
        
        // Set document with uid as the document ID
        await db.collection('users').doc(uid).set({
            uid: uid,
            name: name,
            faculty: faculty,
            major: major,
            track: track,
            secondMajor: secondMajor,
            role: "user",
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
        const { uid,country, university, faculty, major, track, secondMajor, map } = req.body;
        await db.collection('users').doc(uid).collection('maps').add({
            country: country,
            university: university,
            faculty: faculty,
            major: major,
            track: track,
            secondMajor: secondMajor,
            map: map
        });
        res.json({ message: 'Map saved successfully' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to save map' });
    }
})

router.get('/getSavedMaps/:uid', async(req,res) => {
    try {
        const { uid } = req.params;
        const ref = await db.collection('users').doc(uid).collection('maps').get();
        let records = [];
        ref.forEach(doc => {
            let data = doc.data();
            data.id = doc.id;
            records.push(data);
        });
        res.json(records);
    } catch(err) {
        console.log(err);
    }
})

router.delete('/deleteMap/:uid/:mapId', async(req,res) => {
    try {
        const { uid, mapId } = req.params;
        await db.collection('users').doc(uid).collection('maps').doc(mapId).delete();
        res.json({ message: 'Map deleted successfully' });
    } catch(err) {
        console.log(err);
    }
})

router.post('/updateMap', async(req,res) => {
    try {
        const { mapId, uid, map } = req.body;
        await db.collection('users').doc(uid).collection('maps').doc(mapId).update({
            map: map
        });
    }
    catch(err) {
        console.log(err);
    }
})

router.post('/checkAdmin', async(req,res) => {
    try {
        const { uid } = req.body;
        const ref = await db.collection('users').doc(uid).get();
        if (ref.exists) {
            if (ref.data().role === "admin") {
                res.json({ message: "admin" });
            } else {
                res.json({ message: "user" });
            }
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to check' });
    }
})

// New database logic for creating School_Reviews document
// Add or update a student's review for a university
router.post('/saveReview', async (req, res) => {
  try {

    // Get info from frontend
    const { uid, name, university, rating, comment } = req.body;
    // Make sure required fields exist
    if (!uid || !name || !university || rating === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Check if university is valid
    // Look in "Exchange School Info" → official school sources
    const validUniSnap = await db.collection("Exchange School Info")
      .where("host_university", "==", university)
      .get();
    // University not found so we do not allow review
    if (validUniSnap.empty) {
      return res.status(404).json({ error: "University not found in Exchange School Info" });
    }
    // Check if school already exists in review database
    const reviewSchoolSnap = await db.collection("school_reviews")
      .where("name", "==", university)
      .get();
    let schoolId; // we will use this to store the review under the correct uni
    if (reviewSchoolSnap.empty) {
      // First time someone reviews this school → create a doc for the school
      const newSchoolDoc = await db.collection("school_reviews").add({
        name: university,
        created_at: new Date()
      });
      schoolId = newSchoolDoc.id;
    } else {
      // Already reviewed before → reuse the existing document
      schoolId = reviewSchoolSnap.docs[0].id;
    }
    // Save / update the student's review
    // Using 'uid' as doc ID = one review per user (can be updated later)

    const moderation = await openai.moderations.create({ input: comment });
    if (moderation.results[0].flagged) {
        console.log(moderation.results[0]);
      return res.status(400).json({ error: "Review contains inappropriate content" });
    }

    await db.collection("school_reviews")
      .doc(schoolId)
      .collection("user_reviews")
      .doc(uid)
      .set({
        uid,                    // who wrote it
        name,                   // for display
        rating: Number(rating), // make sure it's a number
        comment: comment || "", // avoid undefined
        updated_at: new Date()  // record last edit time
      });

    // Tell frontend everything worked successfully
    res.status(200).json({ success: true, message: "Review posted!" });

  } catch (error) {
    // Something broke → log it on server + notify frontend
    console.error("Error saving review:", error);
    res.status(500).json({ error: "Failed to save review" });
  }
});

// Get all reviews for a specific university
// CRUCIAL BECAUSE frontend needs this to display reviews, without, UI will show nothing
router.get('/getReviews/:university', async (req, res) => {
  try {
    const { university } = req.params;

    // Find the correct school in school_reviews
    const schoolSnap = await db.collection("school_reviews")
      .where("name", "==", university)
      .get();

    if (schoolSnap.empty) {
      return res.json([]); // no reviews yet
    }

    const schoolId = schoolSnap.docs[0].id;

    // Get all user reviews
    const reviewsSnap = await db.collection("school_reviews")
      .doc(schoolId)
      .collection("user_reviews")
      .get();

    const reviews = reviewsSnap.docs.map(doc => doc.data());

    res.json(reviews);

  } catch (err) {
    console.error("Error getting reviews:", err);
    res.status(500).json({ error: "Failed to get reviews" });
  }
});

router.post('/getSchoolsWithReviews', async(req,res) => {
    try {
        const ref = await db.collection('school_reviews').get();
        let records = [];
        ref.forEach(doc => {
            let data = doc.data();
            records.push(data.name);
        });
        res.json(records);
        
    } catch(err) {
        console.log(err);
    }
})

router.delete('/deleteReview/:uid/:school', async (req, res) => {
  try {
    const { uid, school } = req.params;
    // Find the school document first
    const schoolSnap = await db
      .collection('school_reviews')
      .where('name', '==', school)
      .get();

    if (schoolSnap.empty) {
      return res.status(404).json({ error: 'School not found' });
    }

    const schoolDocRef = schoolSnap.docs[0].ref;
    await schoolDocRef.collection('user_reviews').doc(uid).delete();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});