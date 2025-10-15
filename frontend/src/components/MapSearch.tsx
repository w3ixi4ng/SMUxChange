import { useState, useEffect } from "react";
import axios from "axios";
import MapResults from "./MapResults";
import { useParams } from "react-router-dom";

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
    if (schoolParam && countryParam) {
      setSelectedCountry(countryParam);
      setSelectedUniversity(schoolParam);
      setToggleUniversity(false);
    }
  }, [schoolParam, countryParam]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/database/getAllExchangeSchools"
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
        `http://localhost:3001/database/getAllExchangeSchoolsByCountry/${country}`
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
        `http://localhost:3001/database/getAllFaculty`
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
        `http://localhost:3001/database/getFaculty/${faculty}`
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
        `http://localhost:3001/database/getTracksByMajor/${faculty}`
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
        `http://localhost:3001/database/getAllFaculty`
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
    if (selectedCountry) {
      fetchUniversities(selectedCountry);
      setToggleUniversity(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedFaculty) {
      fetchMajors(selectedFaculty);
      setToggleMajor(false);
    }
  }, [selectedFaculty]);

  useEffect(() => {
    if (selectedMajor) {
      fetchTracks(selectedFaculty, selectedMajor);
      setToggleTrack(false);
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
      console.log(uid);
      console.log((sessionStorage.getItem("faculty") || ""));
    }
  }, []);

  return (
    <>
      {/* 📝 Page heading - monochrome consistent with Home */}
      <div className="text-center my-8">
        <h1 className="text-4xl font-semibold text-white">Mappable Search</h1>
        <p className="text-gray-400">Find exchange mappings with ease.</p>
      </div>

      {/* 📝 Form container with dark glass effect */}
      <div className="container col-12 mx-auto bg-white/5 backdrop-blur-md border border-white/10 text-white py-4 rounded-3xl shadow-lg font-medium">
        <div className="row justify-content-center">
          
          {/* === SELECT COUNTRY === */}
          <div className="col-lg-6 col-12 mb-3">
            <p className="text-gray-200 mb-1">Select Country</p>
            {/* 📝 Dropdown is now white with black text, slight gray hover */}
            <select
              className="form-select bg-white text-black border border-white/20 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-gray-300 transition"
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
            <p className="text-gray-200 mb-1">Select University</p>
            <select
              className="form-select bg-white text-black border border-white/20 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-gray-300 transition"
              disabled={toggleUniversity}
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
            <p className="text-gray-200 mb-1">Select Faculty</p>
            <select
              className="form-select bg-white text-black border border-white/20 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-gray-300 transition"
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
            <p className="text-gray-200 mb-1">Select Major</p>
            <select
              className="form-select bg-white text-black border border-white/20 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-gray-300 transition"
              disabled={toggleMajor}
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
            <p className="text-gray-200 mb-1">Select Track</p>
            <select
              className="form-select bg-white text-black border border-white/20 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-gray-300 transition"
              disabled={toggleTrack}
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
              <p className="text-gray-200 mb-1">Select Second Major</p>
              <select
                className="form-select bg-white text-black border border-white/20 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-gray-300 transition"
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
            <label htmlFor="second_major" className="text-gray-200">
              I have a second major
            </label>
          </div>

          {/* === SEARCH BUTTON === */}
          <div className="col-12 text-center mt-2">
            <button
              className="bg-white text-black font-semibold hover:bg-gray-200 hover:scale-105 transition-transform px-8 py-3 text-lg rounded-full shadow-lg"
              onClick={() => setMapResults(true)}
              disabled={paramsAreValid}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* === MAP RESULTS === */}
      {mapResults && (
        <MapResults
          university={selectedUniversity}
          country={selectedCountry}
          faculty={selectedFaculty}
          major={selectedMajor}
          track={selectedTrack}
          secondMajor={selectedSecondMajor}
        />
      )}
    </>
  );
}

export default MapSearch;