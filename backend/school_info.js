// API Configuration - Using backend endpoints
const BACKEND_BASE_URL = 'http://localhost:3001'; // Backend server URL
const EVENTS_API_BASE = `${BACKEND_BASE_URL}/api/events`; // Backend API endpoint
const DISTANCE_API_BASE = `${BACKEND_BASE_URL}/api/distance`; // Backend API endpoint


// School Info JS Module Loaded
console.log('🚀 School Info JS Module Loaded!');



// Sample school data with coordinates for event fetching
const schoolsData = [
    {
        id: 1,
        name: "University of Oxford",
        country: "United Kingdom",
        city: "Oxford",
        gpaRequired: 3.7,
        description: "One of the world's oldest and most prestigious universities, Oxford offers exceptional academic programs in a historic setting. Known for its tutorial system and rigorous academics.",
        courses: ["Computer Science", "Business", "Literature", "History", "Mathematics", "Engineering"],
        attractions: ["Bodleian Library", "Christ Church College", "Oxford Castle", "Ashmolean Museum", "Oxford Botanic Garden"]
    },
    {
        id: 1,
        name: "KIMEP university",
        country: "Kazakhstan",
        city: "Almaty",
        gpaRequired: 3.7,
        description: "One of the world's oldest and most prestigious universities, Oxford offers exceptional academic programs in a historic setting. Known for its tutorial system and rigorous academics.",
        courses: ["Computer Science", "Business", "Literature", "History", "Mathematics", "Engineering"],
        attractions: ["Bodleian Library", "Christ Church College", "Oxford Castle", "Ashmolean Museum", "Oxford Botanic Garden"]
    },
   
];

// Fetch time distances using backend API
async function get_car_distance(origin, destination, mode) {
    try {
        const response = await axios.get(`${DISTANCE_API_BASE}/${origin}/${destination}/${mode}`, {
            timeout: 10000
        });
        console.log('Distance API Response:', response.data);
        return response.data;
    } catch(err) {
        console.log('Distance API Error:', err);
        return null;
    }
}


// Fetch events near a school location using backend API
async function fetchEventsNearSchool(school) {
    try {
        console.log(`Fetching events for ${school.name}...`);
        
        const response = await axios.get(
            `${EVENTS_API_BASE}/${school.city}/${school.country}`, {
            timeout: 10000 // 10 second timeout
        });

        if (response.data && response.data.events_results) {
            console.log(`Found ${response.data.events_results.length} events for ${school.name}`);
            // Return first 5 events with relevant information
            return response.data.events_results.slice(0, 5).map(event => ({
                title: event.title,
                date: event.date?.when || 'Date TBD',
                venue: event.venue?.name || 'Venue TBD',
                address: event.venue?.address || '',
                link: event.link || '#',
            }));
        }
        return [];
    } catch (error) {
        console.error(`Failed to fetch events for ${school.name}:`, error);
        console.error('Error details:', error.response?.data || error.message);
        
        // Return sample events as fallback
        return getSampleEvents(school);
    }
}


// Helper function to get distance for an event using axios
async function getEventDistance(school, event) {
    try {

        console.log(`The value is school:${school.name}, event:${event.venue}`)
        // If venue or address is TBD or unknown, return unknown
        if (!event.venue || event.venue === 'Venue TBD') {
            return {
                walking_time: "nil",
                driving_time: "nil", 
                mrt_time: "nil"
            };
        }

        // Use the event address as destination, school city as origin
        const origin = school.name;
        const destination = event.venue;


        // Make axios requests to your distance endpoint for different modes
        const encodedOrigin = encodeURIComponent(origin);
        const encodedDestination = encodeURIComponent(destination);
        const [walkingResponse, drivingResponse, mrtResponse] = await Promise.allSettled([
            axios.get(`${DISTANCE_API_BASE}/${encodedOrigin}/${encodedDestination}/walking`),
            axios.get(`${DISTANCE_API_BASE}/${encodedOrigin}/${encodedDestination}/driving`),
            axios.get(`${DISTANCE_API_BASE}/${encodedOrigin}/${encodedDestination}/transit`)
        ]);

        return {
            walking_time: walkingResponse.status === 'fulfilled' && walkingResponse.value?.data?.rows?.[0]?.elements?.[0]?.duration?.text || "Unknown",
            driving_time: drivingResponse.status === 'fulfilled' && drivingResponse.value?.data?.rows?.[0]?.elements?.[0]?.duration?.text || "Unknown",
            mrt_time: mrtResponse.status === 'fulfilled' && mrtResponse.value?.data?.rows?.[0]?.elements?.[0]?.duration?.text || "Unknown"
        };
    } catch (error) {
        console.error('Error getting event distance:', error);
        return {
            walking_time: "Unknown",
            driving_time: "Unknown",
            mrt_time: "Unknown"
        };
    }
}

// Fetch events for all schools (with loading states)
async function loadEventsForAllSchools() {
    // First, display all schools with loading events
    schoolsData.forEach(school => {
        school.events = [{ title: "Loading events...", date: "", venue: "", address: "", time:"" , link: "#" , walking_time:"", driving_time:"", mrt_time:""}];
    });
    
    // Display all schools at once
    displaySchools(schoolsData);
    
    // Then fetch events for each school and update individually
    for (const school of schoolsData) {
        try {
            const events = await fetchEventsNearSchool(school);
            console.log('Raw events:', events);
            
            // Add distance calculations for each event using axios requests
            for (const event of events) {
                console.log(`Calculating distances for event: ${event.title}`);
                console.log(`event is ${event.venue}`);
                const distances = await getEventDistance(school, event);
                
                // Add distance data to the event object
                event.walking_time = distances.walking_time;
                event.driving_time = distances.driving_time;
                event.mrt_time = distances.mrt_time;
            }
            
            school.events = events;
            console.log('Events with distances:', school.events);

            // Update the display with the new events for this school
            displaySchools(schoolsData);
        } catch (error) {
            console.error(`Failed to load events for ${school.name}:`, error);
            school.events = [{ title: "Events unavailable", date: "", venue: "", address: "", link: "#", walking_time: "Unknown", driving_time: "Unknown", mrt_time: "Unknown" }];
            displaySchools(schoolsData);
        }
    }
}

// Initialize the application
function initializeApp() {
    console.log('Initializing application...');
    console.log('Schools data available:', schoolsData.length, 'schools');
    
    populateCountryDropdown();
    loadEventsForAllSchools();
}

// Try multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}

// Fallback initialization after a short delay
setTimeout(() => {
    const countrySelect = document.getElementById('country-search');
    if (countrySelect && countrySelect.children.length === 1) {
        console.log('Fallback initialization triggered');
        initializeApp();
    }
}, 100);


// Populate country dropdown with unique countries
function populateCountryDropdown() {
    const countrySelect = document.getElementById('country-search');
    
    if (!countrySelect) {
        console.error('Country select element not found');
        return;
    }
    
    const countries = [...new Set(schoolsData.map(school => school.country))].sort();
    console.log('Countries found:', countries);
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
    
    console.log('Country dropdown populated with', countries.length, 'countries');
}

// Display schools in the grid
function displaySchools(schools) {
    const schoolsGrid = document.getElementById('schools-grid');
    const resultsCount = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    
    // Clear existing content
    schoolsGrid.innerHTML = '';
    
    if (schools.length === 0) {
        noResults.style.display = 'block';
        schoolsGrid.style.display = 'none';
        resultsCount.textContent = 'No schools found';
    } else {
        noResults.style.display = 'none';
        schoolsGrid.style.display = 'grid';
        resultsCount.textContent = `Showing ${schools.length} school${schools.length === 1 ? '' : 's'}`;
        
        schools.forEach(school => {
            const schoolCard = createSchoolCard(school);
            schoolsGrid.appendChild(schoolCard);
        });
    }
}

// Create individual school card
function createSchoolCard(school) {
    console.log(school);
    const card = document.createElement('div');
    card.className = 'school-card';
    
    card.innerHTML = `
        <div class="school-header">
            <h3 class="school-name">${school.name}</h3>
            <div class="school-location">
                📍 ${school.city}, ${school.country}
            </div>
        </div>
        
        <div class="school-info">
            <div class="info-item">
                <span class="info-label">Country:</span>
                <span class="info-value">${school.country}</span>
            </div>
            <div class="info-item">
                <span class="info-label">GPA Required:</span>
                <span class="gpa-requirement">${school.gpaRequired}+</span>
            </div>
        </div>
        
        <div class="description">
            <p>${school.description}</p>
        </div>
        
        <div class="courses-list">
            <div class="courses-title">📚 Available Courses:</div>
            <div class="courses">
                ${school.courses.map(course => `<span class="course-tag">${course}</span>`).join('')}
            </div>
        </div>
        
        <div class="attractions">
            <div class="attractions-title">🏛️ Nearby Attractions:</div>
            <div class="attractions-list">
                ${school.attractions.map(attraction => `<span class="attraction-tag">${attraction}</span>`).join('')}
            </div>
        </div>
        
        <div class="events-section">
            <div class="events-title">🎉 Upcoming Events:</div>
            <div class="events-list">
                ${school.events ? school.events.map(event => `
                    <div class="event-item">
                        <div class="event-title">${event.title}</div>
                        <div class="event-details">
                            <span class="event-date">📅 ${event.date}</span>
                            <span class="event-venue">📍 ${event.venue}</span>
                        </div>
                        <div class="distance-info">
                            <span class="distance-item">🚶 Walking: ${event.walking_time || 'Unknown'}</span>
                            <span class="distance-item">🚗 Driving: ${event.driving_time || 'Unknown'}</span>
                            <span class="distance-item">🚇 MRT: ${event.mrt_time || 'Unknown'}</span>
                        </div>
                        ${event.link !== '#' ? `<a href="${event.link}" target="_blank" class="event-link">More Info →</a>` : ''}
                    </div>
                `).join('') : '<div class="no-events">No events available</div>'}
            </div>
        </div>
    `;
    
    return card;
}

// Filter schools based on search criteria
function filterSchools() {
    const countryFilter = document.getElementById('country-search').value.toLowerCase();
    const schoolFilter = document.getElementById('school-search').value.toLowerCase();
    const gpaFilter = document.getElementById('gpa-filter').value;
    
    let filteredSchools = schoolsData.filter(school => {
        const matchesCountry = !countryFilter || school.country.toLowerCase().includes(countryFilter);
        const matchesSchool = !schoolFilter || 
            school.name.toLowerCase().includes(schoolFilter) ||
            school.city.toLowerCase().includes(schoolFilter);
        const matchesGpa = !gpaFilter || school.gpaRequired >= parseFloat(gpaFilter);
        
        return matchesCountry && matchesSchool && matchesGpa;
    });
    
    displaySchools(filteredSchools);
}

// Add real-time search functionality
document.addEventListener('DOMContentLoaded', function() {
    const schoolSearchInput = document.getElementById('school-search');
    const countrySelect = document.getElementById('country-search');
    const gpaSelect = document.getElementById('gpa-filter');
    
    // Add event listeners for real-time filtering
    schoolSearchInput.addEventListener('input', filterSchools);
    countrySelect.addEventListener('change', filterSchools);
    gpaSelect.addEventListener('change', filterSchools);
});