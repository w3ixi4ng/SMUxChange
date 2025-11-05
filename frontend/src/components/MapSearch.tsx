import { useState, useEffect } from "react";
import axios from "axios";
import MapResults from "./MapResults";
import { useParams } from "react-router-dom";
import { Search, Globe, GraduationCap, BookOpen, Map, School } from "lucide-react";

function TypingAnimation({ text, speed = 100 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="leading-none font-extrabold" style={{ fontFamily: 'inherit' }}>
      {displayedText}
      <span className={showCursor ? "opacity-100" : "opacity-0"}>|</span>
    </span>
  );
}

function MapSearch() {
  const { school: schoolParam, country: countryParam } = useParams();
  const uid = sessionStorage.getItem("uid");


  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [university, setUniversity] = useState<string[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [faculties, setFaculties] = useState<string[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [allMajors, setAllMajors] = useState<string[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [track, setTrack] = useState<string[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>("");


  const [toggleUniversity, setToggleUniversity] = useState(true);
  const [toggleMajor, setToggleMajor] = useState(true);
  const [toggleTrack, setToggleTrack] = useState(true);


  const [secondMajor, setSecondMajor] = useState(false);
  const [allSecondMajors, setAllSecondMajors] = useState<string[]>([]);
  const [selectedSecondMajor, setSelectedSecondMajor] = useState<string>("");


  const [mapResults, setMapResults] = useState(false);


  const [paramsAreValid, setParamsAreValid] = useState(true);


  useEffect(() => {
    if (countryParam && countries.includes(countryParam)) {
      setSelectedCountry(countryParam);
    }
  }, [countryParam, countries]);


  useEffect(() => {
    if (schoolParam && university.includes(schoolParam)) {
      setSelectedUniversity(schoolParam);
    }
  }, [university, schoolParam]);


  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://smuxchange-backend.vercel.app/database/getAllExchangeSchools"
      );


      // Gets all exchange schools from backend, extracts unique country names for dropdown
      const schools = response.data;
      const uniqueCountries = [
        ...new Set(schools.map((school: any) => school.country)),
      ] as string[];
      setCountries(uniqueCountries.sort());
    } catch (error) {
      console.log("API error:", error);
    }
  };


  const fetchUniversities = async (country: string) => {
    try {
      const response = await axios.get(
        `https://smuxchange-backend.vercel.app/database/getAllExchangeSchoolsByCountry/${country}`
      );
      const universities = response.data;
      const uniqueUniversities = [
        ...new Set(
          universities.map((university: any) => university.host_university)
        ),
      ] as string[];
      setUniversity(uniqueUniversities.sort());
    } catch (error) {
      console.log("API error:", error);
    }
  };


  const fetchFaculties = async () => {
    try {
      const response = await axios.get(
        `https://smuxchange-backend.vercel.app/database/getAllFaculty`
      );
      const faculties = response.data;
      const uniqueFaculties = [
        ...new Set(faculties.map((faculty: any) => faculty.Faculty_Name)),
      ] as string[];
      setFaculties(uniqueFaculties.sort());
    } catch (error) {
      console.log("API error:", error);
    }
  };


  const fetchMajors = async (faculty: string) => {
    try {
      const response = await axios.get(
        `https://smuxchange-backend.vercel.app/database/getFaculty/${faculty}`
      );
      const majors = response.data;
      let mappable_mods = JSON.parse(majors[0].Mappable);
      let first_major_obj = mappable_mods[0].Majors["First Major"];
      let first_major_names = Object.keys(first_major_obj);
      setAllMajors(first_major_names.sort());
    } catch (error) {
      console.log("API error:", error);
    }
  };


  const fetchTracks = async (faculty: string, major: string) => {
    try {
      const response = await axios.get(
        `https://smuxchange-backend.vercel.app/database/getTracksByMajor/${faculty}`
      );
      const tracks = response.data;
      let mappable_mods = JSON.parse(tracks[0].Mappable);
      let tracks_names = Object.keys(
        mappable_mods[0].Majors["First Major"][major].Track
      );
      setTrack(tracks_names.sort());
    } catch (error) {
      console.log("API error:", error);
    }
  };


  const fetchSecondMajors = async () => {
    try {
      const response = await axios.get(
        `https://smuxchange-backend.vercel.app/database/getAllFaculty`
      );
      const faculty = response.data;
      let records: string[] = [];
      for (let f of faculty) {
        let mappable_mods = JSON.parse(f.Mappable);
        if (mappable_mods[0].Majors["Second Major"]) {
          let second_major_obj = mappable_mods[0].Majors["Second Major"];
          let second_major_names = Object.keys(second_major_obj);
          records = records.concat(second_major_names);
        }
      }


      setAllSecondMajors(records.sort());
    } catch (error) {
      console.log("API error:", error);
    }
  };


  useEffect(() => {
    fetchCountries();
    fetchFaculties();
  }, []);


  useEffect(() => {
    setMapResults(false);
    setSelectedUniversity(""); 
    if (selectedCountry !== "") {
      fetchUniversities(selectedCountry);
      setToggleUniversity(false);
    } else {
      setToggleUniversity(true);
    }
  }, [selectedCountry]);


  useEffect(() => {
    if (selectedFaculty !== "") {
      fetchMajors(selectedFaculty);
      setToggleMajor(false);
    } else {
      setSelectedMajor("");
      setSelectedTrack("");
      setToggleTrack(true);
      setToggleMajor(true);
    }
  }, [selectedFaculty]);


  useEffect(() => {
    if (selectedMajor !== "") {
      fetchTracks(selectedFaculty, selectedMajor);
      setToggleTrack(false);
    } else {
      setSelectedTrack("");
      setToggleTrack(true);
    }
  }, [selectedMajor]);


  useEffect(() => {
    if (secondMajor) {
      fetchSecondMajors();
    }
  }, [secondMajor]);


  useEffect(() => {
    if (selectedCountry && selectedUniversity && selectedFaculty && selectedMajor) {
      setParamsAreValid(false);
    } else {
      setParamsAreValid(true);
    }
  }, [
    selectedUniversity,
    selectedCountry,
    selectedFaculty,
    selectedMajor,
    selectedTrack,
    selectedSecondMajor,
  ]);


  useEffect(() => {
    if (uid) {
      setSelectedFaculty(sessionStorage.getItem("faculty") || "");
      setSelectedMajor(sessionStorage.getItem("major") || "");
      setSelectedTrack(sessionStorage.getItem("track") || "");
      if (sessionStorage.getItem("secondMajor")) {
        setSecondMajor(true);
        setSelectedSecondMajor(sessionStorage.getItem("secondMajor") || "");
      }
    }
  }, []);


  return (
    <>
      <div className="text-center mb-10">
        <span className="inline-block ml-2 animate-gif-jump"><img src="/images/maps.gif" alt="Maps" className="w-35 h-35 border-2 border-blue-500/30 rounded-lg shadow-lg" /></span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-none bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: 'inherit' }}>
          <TypingAnimation text="Module Mapping" speed={100} />
        </h1>
        <p className="text-xl md:text-2xl text-slate-700 font-medium max-w-3xl mx-auto">
          Discover exchange opportunities and map your modules
        </p>
      </div>

      <div className="w-full max-w-screen-xl mx-auto px-8 lg:px-10 bg-white/80 backdrop-blur-md border border-blue-200 shadow-lg py-8 rounded-3xl font-medium">
        <div className="row justify-content-center">


          {/* === SELECT COUNTRY === */}
          <div className="col-lg-6 col-12 mb-3">


            <p className="mb-1" style={{ color: "#102b72" }}>
                <Globe className="w-4 h-4 text-blue-600 d-inline align-middle" /> Select Country</p>
            <select
              className="form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition"
              style={{ color: "#102b72" }}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Choose a country...</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}


                </option>
              ))}
            </select>
          </div>


          {/* === SELECT UNIVERSITY === */}
          <div className="col-lg-6 col-12 mb-3">
            <p className="mb-1" style={{ color: "#102b72" }}>
                <School className="w-4 h-4 text-blue-600 d-inline align-middle" /> Select University</p>
            <select
              className={`form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition ${toggleUniversity ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              style={{ color: "#102b72" }}
              disabled={toggleUniversity}
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
            >
              <option value="">Choose a university...</option>
              {university.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>


          {/* === SELECT FACULTY === */}
          <div className="col-lg-6 col-12 mb-3">
            <p className="mb-1" style={{ color: "#102b72" }}>
                <BookOpen className="w-4 h-4 text-blue-600 d-inline align-middle" /> Select Faculty</p>
            <select
              className="form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition"
              style={{ color: "#102b72" }}
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="">Choose a faculty...</option>
              {faculties.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
          </div>


          {/* === SELECT MAJOR === */}
          <div className="col-lg-6 col-12 mb-3">
            <p className="mb-1" style={{ color: "#102b72" }}>
                <GraduationCap className="w-4 h-4 text-blue-600 d-inline align-middle" /> Select Major</p>
            <select
              className={`form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition ${toggleMajor ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              style={{ color: "#102b72" }}
              disabled={toggleMajor}
              value={selectedMajor}
              onChange={(e) => {
                setSelectedMajor(e.target.value);
                setSelectedTrack("");
              }}
            >
              <option value="">Choose a major...</option>
              {allMajors.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>


          {/* === SELECT TRACK === */}
          <div className="col-lg-6 col-12 mb-3">
            <p className="mb-1" style={{ color: "#102b72" }}> 
                <Map className="w-4 h-4 text-blue-600 d-inline align-middle" /> Select Track</p>
            <select
              className={`form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition ${toggleTrack ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              style={{ color: "#102b72" }}
              disabled={toggleTrack}
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
            >
              <option value="">Select a track...</option>
              {track.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>


          {/* === SECOND MAJOR (optional) === */}
          {secondMajor && (
            <div className="col-lg-6 col-12 mb-3">
              <p className="mb-1" style={{ color: "#102b72" }}><GraduationCap className="w-4 h-4 text-blue-600 d-inline align-middle" /> Select Second Major</p>
              <select
                className="form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition"
                style={{ color: "#102b72" }}
                value={selectedSecondMajor}
                onChange={(e) => setSelectedSecondMajor(e.target.value)}
              >
                <option value="">Select a second major...</option>
                {allSecondMajors.map((sm) => (
                  <option key={sm} value={sm}>
                    {sm}
                  </option>
                ))}
              </select>
            </div>
          )}


          {/* === CHECKBOX === */}
          <div className="col-12 mb-3 text-start">
            <input
              id="second_major"
              className="form-check-input me-2"
              type="checkbox"
              onChange={() => setSecondMajor(!secondMajor)}
              checked={secondMajor}
            />
            <label htmlFor="second_major" style={{ color: "#102b72" }}>
              I have a second major
            </label>
          </div>


          {/* === SEARCH BUTTON === */}
          <div className="col-12 text-center mt-4">
            <button
              className="group relative overflow-hidden bg-blue-600 text-white font-bold px-8 py-2 text-lg rounded shadow-2xl transition-all duration-300 hover:shadow-blue-500/50 hover:bg-blue-700 animate-jump-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-blue-600"
              onClick={() => setMapResults(true)}
              disabled={paramsAreValid}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Search
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </div>


      {/* === MAP RESULTS === */}

      {mapResults && (
        <>
          <div id="results" />
          <MapResults
            university={selectedUniversity}
            country={selectedCountry}
            faculty={selectedFaculty}
            major={selectedMajor}
            track={selectedTrack}
            secondMajor={selectedSecondMajor}
          />

        </>
      )}
    </>
  );
}

export default MapSearch;
