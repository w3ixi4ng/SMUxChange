# SMUxChange

A streamlined, student-centric platform designed to simplify the exchange planning experience for SMU students.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [APIs Used](#apis-used)
- [Project Objectives](#project-objectives)
- [Team](#team)
- [Link to Website](#link-to-website)

---

## 🌍 Overview

SMUxChange is an all-in-one platform designed to help SMU students seamlessly plan their international exchange programs. It integrates course mapping tools, peer insights, and curated recommendations on nearby accommodations and activities, offering a complete solution for every stage of the exchange experience.

---

## 🎯 Problem Statement

SMU students face several challenges when planning their international exchanges:

- **Complex Module Mapping:** The OASIS Exchange Course Mapping system is difficult to navigate and unintuitive for students seeking relevant information like GPA requirements, module mappings, or exchange destinations.
- **Uncertainty in degree requirements:** Because of the system’s complexity, students often struggle to determine which host universities and modules can actually help fulfill their SMU degree requirements. 
- **Lack of authentic peer advice:** here is limited access to real student reviews on exchange university and not much information on destination tips and accommodations. As a result, students mainly get their information via word of mouth which is inefficient.

**SMUxChange addresses these pain points by providing an intuitive, student-centered platform that streamlines the entire exchange planning process.**

---

## ✨ Key Features

1. **Personalized School Recommendations**
   - Students input their Faculty, Major, Track, and Second Major.
   - Smart filtering by country and course area.
   - Shows schools with GPA requirements, mappable areas, and more.

2. **Smart Module Mapping**
   - Browse previously approved module mappings from past data.
   - Select modules aligned with targeted course baskets.
   - Autofill criteria such as faculty, major, and track based on profile.
   - Save multiple mappings and share via QR code with peers.

3. **Student Reviews & Insights**
   - Access detailed reviews from seniors who attended exchange universities.
   - Share your own reviews to help future exchange students.

4. **Local Resources & Attractions**
   - Discover popular and local places of interest near selected exchange schools.
   - Find accommodation options nearby.

5. **Interactive Maps & Distance Calculations**
   - Visualize accommodations, events, and attractions on Google Maps.
   - Calculate distances and travel times from the exchange schools to these locations.

---

## 🛠️ Tech Stack

**Frontend**
- ReactJS with TypeScript – Type-safe component-based UI
- Bootstrap 5 – Responsive design framework
- Tailwind CSS – Utility-first styling framework
- shadcn/ui – Prebuilt accessible React components
- Lucide – Open-source icon library
- CSS – Custom styles for unique branding

**Backend**
- Node.js – Backend server runtime
- AWS EC2 – Hosting infrastructure

**Database**
- Firebase Firestore (NoSQL) – Manages course mapping info, user credentials, and student reviews

**Deployment**
- Vercel – Frontend deployment and hosting

---

## 🔌 APIs Used

1. **Google Events API (SerpAPI)** – Generates local events near exchange universities.  
   [Docs](https://developers.google.com/events)

2. **Google Geocoding API** – Converts addresses into geographic coordinates for map plotting.  
   [Docs](https://developers.google.com/maps/documentation/geocoding)

3. **Google Routes API** – Calculates distances and travel times between locations.  
   [Docs](https://developers.google.com/maps/documentation/routes)

4. **Google Places API** – Finds nearby apartments and housing options.  
   [Docs](https://developers.google.com/maps/documentation/places)

5. **Google Maps JavaScript API** – Displays interactive maps of accommodations and events.  
   [Docs](https://developers.google.com/maps/documentation/javascript)

6. **OpenAI API** – Moderates user-generated comments to maintain a positive community.  
   [Docs](https://platform.openai.com/docs/)

---

## 🎯 Project Objectives

- **Simplify Module Planning** – Explore which modules at host schools fulfill graduation requirements.
- **Share Exchange Information** – Offer up-to-date info on partner universities, accommodation, and events.
- **Build Community Connections** – Enable students to share module mappings and foster a supportive SMU student network.

---

## 👥 Team

- Cham Shin Ron  
- Nilremik Foo  
- Lau Wei Xiang  
- Matthew Chan Mung Kong  
- Dylan Huang Kai Jun  

---

## 🔗 Link to Website

[https://smuxchange.vercel.app/](https://smuxchange.vercel.app/)

---

Made with ❤️ by SMU students, for SMU students
