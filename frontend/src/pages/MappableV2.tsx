import axios from "axios";
import { useState, useEffect } from "react";

function MappableV2() {
    // State management for all dropdown options - stores available choices from API
    const [countries, setCountries] = useState<string[]>([]);
    const [universities, setUniversities] = useState<string[]>([]);
    const [faculties, setFaculties] = useState<string[]>([]);
    const [majors, setMajors] = useState<string[]>([]);
    const [secondMajors, setSecondMajors] = useState<string[]>([]);
    const [tracks, setTracks] = useState<string[]>([]);

  // State for tracking what the student has selected in each dropdown
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [hasSecondMajor, setHasSecondMajor] = useState<boolean>(false);
  const [selectedSecondMajor, setSelectedSecondMajor] = useState<string>("");
  
  // State for managing the course search results and UI loading states
  const [moduleCategories, setModuleCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // State for tracking course mapping and limits
  const [selectedCourses, setSelectedCourses] = useState<{[categoryId: string]: any[]}>({});
  const [courseLimits, setCourseLimits] = useState<{[categoryId: string]: number}>({});

  const fetchCountries = async () => {
    console.log("fetchCountries function");
    try {
      const response = await axios.get("http://localhost:3001/database/getAllExchangeSchools");
      console.log("API response received:", response.data);
      
      // Gets all exchange schools from backend, extracts unique country names for dropdown
      const schools = response.data;
      const uniqueCountries = [...new Set(schools.map((school: any) => school.country))] as string[];
      setCountries(uniqueCountries.sort());
      
    } catch (error) {
      console.log("API error:", error);
    }
  };

  const fetchUniversities = async (country: string) => {
    console.log("fetchUniversities called for:", country);
    try {
      const response = await axios.get(`http://localhost:3001/database/getAllExchangeSchoolsByCountry/${country}`);
      console.log("Universities API response:", response.data);
      
      // Filters universities by selected country and populates university dropdown
      const schools = response.data;
      // If yall dont know what the ... means it means expand hahaha //
      const uniqueUniversities = [...new Set(schools.map((school: any) => school.host_university))] as string[];
      setUniversities(uniqueUniversities.sort());
      
    } catch (error) {
      console.log("Universities API error:", error);
    }
  };

  const fetchFaculties = async () => {
    console.log("fetchFaculties function called!");
    try {
      const response = await axios.get("http://localhost:3001/database/getAllFaculty");
      console.log("Faculties API response:", response.data);
      
      // Gets all SMU faculties (like LKCSB, SCIS, etc.) for faculty dropdown
      const facultyData = response.data;
      const facultyNames = facultyData.map((faculty: any) => faculty.Faculty_Name);
      setFaculties(facultyNames.sort());
      
    } catch (error) {
      console.log("Faculties API error:", error);
    }
  };

  const fetchMajors = async (facultyName: string) => {
    console.log("=== ANALYZING FACULTY DATA FOR:", facultyName, "===");
    try {
      const response = await axios.get(`http://localhost:3001/database/getFaculty/${facultyName}`);
      console.log("Faculty API response:", response.data);
      
      if (response.data && response.data[0] && response.data[0].Mappable) {
        const mappableData = JSON.parse(response.data[0].Mappable)[0];
        console.log("Parsed mappable data:", mappableData);
        
        if (mappableData.Majors) {
          console.log("=== MAJORS ANALYSIS ===");
          
          // Parses faculty JSON to extract first majors (Finance, Marketing, etc.)
          if (mappableData.Majors["First Major"]) {
            const firstMajorNames = Object.keys(mappableData.Majors["First Major"]);
            const validFirstMajors = firstMajorNames.filter(major => major !== "No Major");
            console.log("Available first majors:", validFirstMajors);
            setMajors(validFirstMajors.sort());
            
            // Analyzes which majors have tracks (like Finance Analytics Track)
            console.log("=== TRACKS ANALYSIS ===");
            const allTracks: {[key: string]: string[]} = {};
            validFirstMajors.forEach(major => {
              const majorData = mappableData.Majors["First Major"][major];
              if (majorData.Track && Object.keys(majorData.Track).length > 0) {
                const trackNames = Object.keys(majorData.Track);
                allTracks[major] = trackNames;
                console.log(`${major} has tracks:`, trackNames);
              } else {
                console.log(`${major} has no tracks`);
              }
            });
            
            // Temporarily stores track data in window for later access
            (window as any).facultyTracksData = allTracks;
          }
          
          // Extracts second major options (Digital Business, Sustainability, etc.)
          if (mappableData.Majors["Second Major"]) {
            const secondMajorNames = Object.keys(mappableData.Majors["Second Major"]);
            console.log("Available second majors:", secondMajorNames);
            setSecondMajors(secondMajorNames.sort());
            
            // Stores second major data for later use
            (window as any).facultySecondMajorsData = mappableData.Majors["Second Major"];
          } else {
            console.log("No Second Major found");
            setSecondMajors([]);
          }
          
          // Resets tracks when faculty changes
          setTracks([]);
          
        } else {
          console.log("No Majors found in mappable data");
          setMajors([]);
          setSecondMajors([]);
          setTracks([]);
        }
      } else {
        console.log("No mappable data found");
        setMajors([]);
        setSecondMajors([]);
        setTracks([]);
      }
      
    } catch (error) {
      console.log("Error fetching majors:", error);
      setMajors([]);
      setSecondMajors([]);
      setTracks([]);
    }
  };

  const fetchTracksForMajor = (majorName: string) => {
    console.log("=== FETCHING TRACKS FOR MAJOR:", majorName, "===");
    const tracksData = (window as any).facultyTracksData;
    
    // Loads available tracks for the selected major (e.g., Finance Analytics, Banking Track)
    if (tracksData && tracksData[majorName]) {
      console.log("Tracks found for", majorName, ":", tracksData[majorName]);
      setTracks(tracksData[majorName]);
    } else {
      console.log("No tracks found for", majorName);
      setTracks([]);
    }
  };

  // Extracts course limits from mappable data (e.g., "Technology, Science & Society": 1)
  const extractCourseLimits = (mappableMods: any) => {
    const limits: {[key: string]: number} = {};
    
    for (let category in mappableMods) {
      if (typeof mappableMods[category] === 'number') {
        // Direct limit (e.g., "Technology, Science & Society": 1)
        limits[category] = mappableMods[category];
      } else if (Array.isArray(mappableMods[category]) && mappableMods[category].length >= 2) {
        // Array format [limit, categoryName] (e.g., [2, "Finance Major Elective"])
        limits[mappableMods[category][1]] = mappableMods[category][0];
      }
    }
    
    console.log("Extracted course limits:", limits);
    setCourseLimits(limits);
  };

  // Handles course selection/deselection
  const toggleCourseSelection = (categoryId: string, course: any) => {
    setSelectedCourses(prev => {
      const current = prev[categoryId] || [];
      const isSelected = current.some(selected => selected.id === course.id);
      
      if (isSelected) {
        // Remove course
        return {
          ...prev,
          [categoryId]: current.filter(selected => selected.id !== course.id)
        };
      } else {
        // Add course (check limit first)
        const limit = courseLimits[categoryId] || 0;
        if (current.length >= limit && limit > 0) {
          alert(`You can only select ${limit} course(s) for ${categoryId}`);
          return prev;
        }
        return {
          ...prev,
          [categoryId]: [...current, course]
        };
      }
    });
  };

  // Checks if a category has reached its limit
  const isCategoryAtLimit = (categoryId: string) => {
    const limit = courseLimits[categoryId] || 0;
    const selected = selectedCourses[categoryId] || [];
    return limit > 0 && selected.length >= limit;
  };

  // Gets the number of selected courses for a category
  const getSelectedCount = (categoryId: string) => {
    return (selectedCourses[categoryId] || []).length;
  };
  
  // Loads initial data when page loads
  useEffect(() => {
    fetchCountries();
    fetchFaculties();
  }, []);

  // Loads universities when country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetchUniversities(selectedCountry);
    }
  }, [selectedCountry]);

  // Loads majors and tracks when faculty is selected
  useEffect(() => {
    console.log("Faculty changed to:", selectedFaculty);
    if (selectedFaculty) {
      console.log("Calling fetchMajors for:", selectedFaculty);
      fetchMajors(selectedFaculty);
    } else {
      console.log("No faculty selected, clearing majors");
      setMajors([]);
      setSecondMajors([]);
      setTracks([]);
    }
  }, [selectedFaculty]);

  // Loads tracks when major is selected
  useEffect(() => {
    console.log("Major changed to:", selectedMajor);
    if (selectedMajor) {
      fetchTracksForMajor(selectedMajor);
    } else {
      setTracks([]);
    }
  }, [selectedMajor]);

  // Shin Ron's function: Gets all mappable course categories for a student's faculty/major/track
  async function fetch_mappable(
    faculty_name: string,
    major_name: string,
    track_name: string,
    second_major: boolean
  ) {
    let arr: { [key: string]: any } = {};
    try {
      const response = await axios.get(
        `http://localhost:3001/database/getFaculty/${faculty_name}`
      );
      var mappable_mods = response.data[0].Mappable;
      var mods_json = JSON.parse(mappable_mods)[0];
      console.log("=== FULL MAPPABLE DATA STRUCTURE ===");
      console.log("Available sections:", Object.keys(mods_json));
      console.log("Full data:", mods_json);
      
      // Processes each section: handles major-specific courses and university-wide courses
      for (let type_mods in mods_json) {
        console.log(`Processing section: ${type_mods}`);
        if (type_mods == "Majors") {
          console.log("Processing Majors section...");
          get_mappable_majors(
            mods_json[type_mods],
            second_major,
            major_name,
            track_name,
            arr
          );
        } else {
          // Adds university-wide modules (Technology Science & Society, Cultures, etc.)
          console.log(`Adding university-wide section: ${type_mods}`, mods_json[type_mods]);
          arr[type_mods] = mods_json[type_mods];
        }
      }
      
      console.log("=== FINAL RESULT ===");
      console.log("Final arr keys:", Object.keys(arr));
      console.log("Final arr:", arr);
    } catch (err) {
      console.log(err);
    }
    return arr;
  }

  // Shin Ron's helper function: Processes both first major and second major requirements
  function get_mappable_majors(
    major_object: { [key: string]: any },
    second_major: boolean,
    major_name: string,
    track_name: string,
    final_object: { [key: string]: any }
  ) {
    var first_major_obj = major_object["First Major"];
    get_mappable_helper(first_major_obj, major_name, track_name, final_object);
    if (second_major == true) {
      // Also processes second major requirements if student has one
      get_mappable_helper(
        major_object["Second Major"],
        major_name,
        track_name,
        final_object
      );
    }
  }

  // Shin Ron's core logic: Extracts course categories based on student's major and track selection
  function get_mappable_helper(
    major_object: { [key: string]: any },
    major_name: string,
    track_name: string,
    final_object: { [key: string]: any }
  ) {
    for (let majors in major_object) {
      if (majors == major_name) {
        var major_obj = major_object[majors];
        for (let major_mods in major_obj) {
          if (major_mods == "Track") {
            // Handles track-specific courses (e.g., Finance Analytics Track Elective)
            var track_mods = major_obj[major_mods];
            for (let tracks in track_mods) {
              if (tracks == track_name) {
                final_object[track_mods[tracks][1]] = track_mods[tracks][0];
              }
            }
          } else {
            // Handles general major courses (e.g., Finance Major Elective)
            final_object[major_obj[major_mods][1]] = major_obj[major_mods][0];
          }
        }
      }
    }
  }

  // Shin Ron's function: Finds actual courses at the chosen university for each course category
  async function get_specific_mods(
    mappable_mods: { [key: string]: any },
    university_chosen: string
  ) {
    console.log("=== GET_SPECIFIC_MODS DEBUG ===");
    console.log("University chosen:", university_chosen);
    console.log("Mappable mods keys:", Object.keys(mappable_mods));
    
    var return_obj = [];
    var id = 1;
    for (let keys in mappable_mods) {
      console.log(`\n--- Processing category: ${keys} ---`);
      var return_object: { [key: string]: any } = {};
      return_object.id = keys;
      return_object.name = keys;
      
      try {
        console.log(`Calling API: getByCourseAreaAndUniversity/${keys}/${university_chosen}`);
        // Searches database for courses in this category at the chosen university
        var response = await axios.get(
          `http://localhost:3001/database/getByCourseAreaAndUniversity/${keys}/${university_chosen}`
        );
        var mod_details = response.data;
        console.log(`API response for ${keys}:`, mod_details);
        
        var pill_data = [];
        for (let values in mod_details) {
          pill_data.push({
            id: id,
            text: mod_details[values]["Course Title"],
            width: "auto",
          });
          id++;
        }
        return_object.pills = pill_data;
        console.log(`Courses found for ${keys}:`, pill_data.length);
      } catch (err) {
        console.log(`Error for ${keys}:`, err);
      }
      
      // Only includes categories that have actual courses available
      if (return_object.pills && return_object.pills.length > 0) {
        console.log(`Adding ${keys} to results with ${return_object.pills.length} courses`);
        return_obj.push(return_object);
      } else {
        console.log(`Skipping ${keys} - no courses found`);
      }
    }
    
    console.log("=== FINAL SPECIFIC MODS RESULT ===");
    console.log("Total categories with courses:", return_obj.length);
    console.log("Result:", return_obj);
    return return_obj;
  }

    return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mappable Courses V2</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Country Selection: Student chooses their desired exchange destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Country:
            </label>
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a country...</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* University Selection: Filters to universities in the selected country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select University:
            </label>
            <select 
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              disabled={!selectedCountry}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Choose a university...</option>
              {universities.map((university, index) => (
                <option key={index} value={university}>
                  {university}
                </option>
              ))}
            </select>
          </div>

          {/* Faculty Selection: Student's SMU faculty (LKCSB, SCIS, etc.) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Faculty:
            </label>
            <select 
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a faculty...</option>
              {faculties.map((faculty, index) => (
                <option key={index} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
          </div>

          {/* Major Selection: Student's primary major (Finance, Marketing, etc.) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Major:
            </label>
            <select 
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              disabled={!selectedFaculty}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Choose a major...</option>
              {majors.map((major, index) => (
                <option key={index} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>

          {/* Track Selection: Optional specialization within the major */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Track (Optional):
            </label>
            <select 
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              disabled={!selectedMajor}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Choose a track (optional)...</option>
              {tracks.map((track, index) => (
                <option key={index} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </div>

          {/* Second Major Section: Optional second major selection for students */}
          <div>
            <div className="flex items-center mb-3">
              <input 
                type="checkbox" 
                id="hasSecondMajor"
                checked={hasSecondMajor}
                onChange={(e) => setHasSecondMajor(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasSecondMajor" className="ml-2 block text-sm font-medium text-gray-700">
                I have a second major
              </label>
            </div>
            
            {hasSecondMajor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Second Major:
                </label>
                <select 
                  value={selectedSecondMajor}
                  onChange={(e) => setSelectedSecondMajor(e.target.value)}
                  disabled={!selectedFaculty}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Choose a second major...</option>
                  {secondMajors.map((major, index) => (
                    <option key={index} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Submit Button: Calls Shin Ron's functions to find mappable courses */}
          <button 
            onClick={async () => {
              console.log('Selected:', {
                country: selectedCountry,
                university: selectedUniversity,
                faculty: selectedFaculty,
                major: selectedMajor,
                track: selectedTrack || "General",
                secondMajor: hasSecondMajor ? selectedSecondMajor : null
              });
              
              try {
                setIsLoading(true);
                setShowResults(false);
                
                // Step 1: Using Shin Ron's fetch_mappable function to get course categories
                console.log('Calling fetch_mappable...');
                const mappableMods = await fetch_mappable(
                  selectedFaculty,
                  selectedMajor,
                  selectedTrack || "General", // Use selected track or default to "General"
                  hasSecondMajor
                );
                
                console.log("Mappable modules:", mappableMods);
                
                // Store mappable data and extract course limits
                extractCourseLimits(mappableMods);
                
                // Step 2: Using Shin Ron's get_specific_mods function to find actual courses
                console.log('Calling get_specific_mods...');
                const specificMods = await get_specific_mods(
                  mappableMods,
                  selectedUniversity
                );
                
                console.log("Specific modules for university:", specificMods);
                
                // Displays the results to the student and reset selected courses
                setModuleCategories(specificMods);
                setSelectedCourses({}); // Reset selected courses for new search
                setShowResults(true);
                
                if (specificMods.length === 0) {
                  alert("No mappable courses found for your selection. Try a different university or check your selections.");
                }
                
              } catch (error) {
                console.error("Error fetching mappable courses:", error);
                alert("Error fetching mappable courses. Check console for details.");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={!selectedCountry || !selectedUniversity || !selectedFaculty || !selectedMajor}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Finding Courses..." : "Find Mappable Courses"}
          </button>
        </div>

        {/* Results Section: Displays courses found by Shin Ron's functions with mapping functionality */}
        {showResults && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Courses at {selectedUniversity}
            </h2>
            
            {moduleCategories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">
                  No mappable courses found for your selection.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Try selecting a different university or check your faculty/major combination.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {moduleCategories.map((category) => {
                  const categoryId = category.id || category.name;
                  const limit = courseLimits[categoryId] || 0;
                  const selectedCount = getSelectedCount(categoryId);
                  const isAtLimit = isCategoryAtLimit(categoryId);
                  
                  return (
                    <div 
                      key={categoryId} 
                      className={`border rounded-lg p-6 shadow-sm transition-all ${
                        isAtLimit 
                          ? 'bg-gray-100 border-gray-300 opacity-75' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className={`font-semibold text-lg border-b pb-2 ${
                          isAtLimit 
                            ? 'text-gray-500 border-gray-300' 
                            : 'text-gray-800 border-gray-100'
                        }`}>
                          {category.name}
                        </h3>
                        {limit > 0 && (
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isAtLimit 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {selectedCount} / {limit} selected
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {category.pills && category.pills.length > 0 ? (
                          category.pills.map((pill: any, pillIndex: number) => {
                            const isSelected = (selectedCourses[categoryId] || []).some(
                              selected => selected.id === pill.id
                            );
                            const canSelect = !isAtLimit || isSelected;
                            
                            return (
                              <div
                                key={pill.id || pillIndex}
                                onClick={() => canSelect && toggleCourseSelection(categoryId, pill)}
                                className={`rounded-md px-3 py-2 text-sm transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-green-100 border-2 border-green-400 text-green-800'
                                    : canSelect
                                    ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{pill.text}</span>
                                  {isSelected && (
                                    <span className="text-green-600 font-bold">✓</span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-gray-400 text-sm italic">
                            No courses available in this category
                          </div>
                        )}
                      </div>
                      
                      {isAtLimit && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-700 text-sm font-medium">
                            ⚠️ Category limit reached ({limit} course{limit > 1 ? 's' : ''} maximum)
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    );
  }
  
  export default MappableV2;
