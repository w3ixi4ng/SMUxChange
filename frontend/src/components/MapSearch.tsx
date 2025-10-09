import { useState, useEffect } from "react";
import axios from "axios";
import MapResults from "./MapResults";





function MapSearch() {
    const [countries, setCountries] = useState<string[]>([]);
    const [country, setCountry] = useState<string>("");
    const [university, setUniversity] = useState<string[]>([]);
    const [selectedUniversity, setSelectedUniversity] = useState<string>("");
    const [faculties, setFaculties] = useState<string[]>([]);
    const [faculty, setFaculty] = useState<string>("");
    const [allMajors, setAllMajors] = useState<string[]>([]);
    const [major, setMajor] = useState<string>("");
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



    const fetchCountries = async () => {
        try {
            const response = await axios.get("http://localhost:3001/database/getAllExchangeSchools");

            // Gets all exchange schools from backend, extracts unique country names for dropdown
            const schools = response.data;
            const uniqueCountries = [...new Set(schools.map((school: any) => school.country))] as string[];
            setCountries(uniqueCountries.sort());

        } catch (error) {
            console.log("API error:", error);
        }
    };

    const fetchUniversities = async (country: string) => {
        try {
            const response = await axios.get(`http://localhost:3001/database/getAllExchangeSchoolsByCountry/${country}`);
            const universities = response.data;
            const uniqueUniversities = [...new Set(universities.map((university: any) => university.host_university))] as string[];
            setUniversity(uniqueUniversities.sort());
        } catch (error) {
            console.log("API error:", error);
        }
    }

    const fetchFaculties = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/database/getAllFaculty`);
            const faculties = response.data;
            const uniqueFaculties = [...new Set(faculties.map((faculty: any) => faculty.Faculty_Name))] as string[];
            setFaculties(uniqueFaculties.sort());
        } catch (error) {
            console.log("API error:", error);
        }
    }

    const fetchMajors = async (faculty: string) => {
        try {
            const response = await axios.get(`http://localhost:3001/database/getFaculty/${faculty}`);
            const majors = response.data;
            let mappable_mods = JSON.parse(majors[0].Mappable);
            let first_major_obj = mappable_mods[0].Majors['First Major'];
            let first_major_names = Object.keys(first_major_obj);
            setAllMajors(first_major_names.sort());
        }
        catch (error) {
            console.log("API error:", error);
        }
    }

    const fetchTracks = async (faculty: string, major: string) => {
        try {
            const response = await axios.get(`http://localhost:3001/database/getTracksByMajor/${faculty}`);
            const tracks = response.data;
            let mappable_mods = JSON.parse(tracks[0].Mappable);
            let tracks_names = Object.keys(mappable_mods[0].Majors['First Major'][major].Track);
            setTrack(tracks_names.sort());

        }
        catch (error) {
            console.log("API error:", error);
        }
    }

    const fetchSecondMajors = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/database/getAllFaculty`);
            const faculty = response.data;
            let records: string[] = [];
            for (let f of faculty) {
                let mappable_mods = JSON.parse(f.Mappable);
                if (mappable_mods[0].Majors['Second Major']) {
                    let second_major_obj = mappable_mods[0].Majors['Second Major'];
                    let second_major_names = Object.keys(second_major_obj);
                    records = records.concat(second_major_names);
                }
            }

            setAllSecondMajors(records.sort());
        }
        catch (error) {
            console.log("API error:", error);
        }
    }

    useEffect(() => {
        fetchCountries();
        fetchFaculties();
    }, []);

    useEffect(() => {
        if (country) {
            fetchUniversities(country);
            setToggleUniversity(false);
        }
    }, [country]);

    useEffect(() => {
        if (faculty) {
            fetchMajors(faculty);
            setToggleMajor(false);
        }
    }, [faculty]);

    useEffect(() => {
        if (major) {
            fetchTracks(faculty, major);
            setToggleTrack(false);
        }
    }, [major]);

    useEffect(() => {
        if (secondMajor) {
            fetchSecondMajors();
        }
    }, [secondMajor]);

    useEffect(() => {
        if (country && selectedUniversity && faculty && major) {
            setParamsAreValid(false);
        } else {
            setParamsAreValid(true);
        }
    }, [selectedUniversity, country, faculty, major, selectedTrack, selectedSecondMajor]);


    return (
        <>
            <div className="container col-12 mx-auto mt-5 mb-1">
                <h1>Mappable</h1>
            </div>
            <div className="container col-12 mx-auto bg-blue-100 py-3 rounded shadow-md font-semibold">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-12 mb-2">
                        <p className="text-start mb-1 ml-1">Select Country</p>
                        <select className="form-select" onChange={(e) => setCountry(e.target.value)}>
                            <option selected value="">Choose a country...</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-lg-6 col-12 mb-2">
                        <p className="text-start mb-1 ml-1">Select University</p>
                        <select className="form-select" disabled={toggleUniversity} onChange={(e) => setSelectedUniversity(e.target.value)}>
                            <option selected value="">Choose a university...</option>
                            {university.map((uni) => (
                                <option key={uni} value={uni}>{uni}</option>))}
                        </select>
                    </div>
                    <div className="col-lg-6 col-12 mb-2">
                        <p className="text-start mb-1 ml-1">Select Faculty</p>
                        <select className="form-select" onChange={(e) => setFaculty(e.target.value)}>
                            <option selected value="">Choose a faculty...</option>
                            {faculties.map((faculty) => (
                                <option key={faculty} value={faculty}>{faculty}</option>))}
                        </select>
                    </div>
                    <div className="col-lg-6 col-12 mb-2">
                        <p className="text-start mb-1 ml-1">Select Major</p>
                        <select disabled={toggleMajor} className="form-select" onChange={(e) => setMajor(e.target.value)}>
                            <option selected value="">Choose a major...</option>
                            {allMajors.map((major) => (
                                <option key={major} value={major}>{major}</option>))}
                        </select>
                    </div>
                    <div className="col-lg-6 col-12 mb-2">
                        <p className="text-start mb-1 ml-1">Select Track</p>
                        <select disabled={toggleTrack} className="form-select" onChange={(e) => setSelectedTrack(e.target.value)}>
                            <option selected value="">Select a track...</option>
                            {track.map((track) => (
                                <option key={track} value={track}>{track}</option>))}
                        </select>
                    </div>
                    <div className="col-lg-6 col-12 mb-2" style={{ display: secondMajor ? "block" : "none" }}>
                        <p className="text-start mb-1 ml-1">Select Second Major</p>
                        <select className="form-select" onChange={(e) => setSelectedSecondMajor(e.target.value)}>
                            <option selected value="">Select a second major...</option>
                            {allSecondMajors.map((secondMajor) => (
                                <option key={secondMajor} value={secondMajor}>{secondMajor}</option>))}
                        </select>
                    </div>
                    <div className="col-12 mb-2">
                        <div className="form-check text-start mb-1 ml-1">
                            <input id='second_major' className="form-check-input" type="checkbox" onChange={() => setSecondMajor(!secondMajor)}>
                            </input>
                            <label className="form-check-label" htmlFor='second_major'>
                                I have a second major
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button className="btn btn-primary px-5" onClick={() => setMapResults(true)} disabled={paramsAreValid}>Search</button>
                    </div>
                </div>
            </div>

            {mapResults && (
                <MapResults university={selectedUniversity} country={country} faculty={faculty} major={major} track={selectedTrack} secondMajor={selectedSecondMajor} />
            )}
        </>
    )
}

export default MapSearch;