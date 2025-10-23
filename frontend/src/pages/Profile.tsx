import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const uid = sessionStorage.getItem("uid");
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) {
      navigate("/login");
    }
  }, []);

  const [toggleMajor, setToggleMajor] = useState(true);
  const [toggleTrack, setToggleTrack] = useState(true);

  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [major, setMajor] = useState("");
  const [track, setTrack] = useState("");
  const [secondMajor, setSecondMajor] = useState("");

  const [faculties, setFaculties] = useState<string[]>([]);
  const [majors, setAllMajors] = useState<string[]>([]);
  const [tracks, setAllTracks] = useState<string[]>([]);
  const [secondMajors, setAllSecondMajors] = useState<string[]>([]);

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
      setAllTracks(tracks_names.sort());
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
    fetchFaculties();
    fetchSecondMajors();
  }, []);

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

  const handleUpdate = () => {
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("faculty", faculty);
    sessionStorage.setItem("major", major);
    sessionStorage.setItem("track", track);
    sessionStorage.setItem("secondMajor", secondMajor);
    console.log(sessionStorage.getItem("name"), sessionStorage.getItem("faculty"), sessionStorage.getItem("major"), sessionStorage.getItem("track"), sessionStorage.getItem("secondMajor"));
  };

  useEffect(() => {
    setName(sessionStorage.getItem("name") || "");
    setFaculty(sessionStorage.getItem("faculty") || "");
    setMajor(sessionStorage.getItem("major") || "");
    setTrack(sessionStorage.getItem("track") || "");
    setSecondMajor(sessionStorage.getItem("secondMajor") || "");
  }, []);

  return (
    <>
      <div className="container col-12 mx-auto mb-1-">
        <h1>Profile</h1>
      </div>
      <div className="container col-12 mx-auto bg-light py-3 rounded shadow-md font-semibold">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-12 mb-2">
            <p className="text-start mb-1 ml-1">Name</p>
            <input
              type="text"
              className="form-control"
              value={name}
              placeholder="Enter your name ..."
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-lg-6 col-12 mb-2">
            <p className="text-start mb-1 ml-1">Faculty</p>
            <select
              className="form-select"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
            >
              <option value="">Choose your faculty...</option>
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-6 col-12 mb-2">
            <p className="text-start mb-1 ml-1">Major</p>
            <select
              className="form-select"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              disabled={toggleMajor}
            >
              <option value="">Choose your major...</option>
              {majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-6 col-12 mb-2">
            <p className="text-start mb-1 ml-1">Track</p>
            <select
              className="form-select"
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              disabled={toggleTrack}
            >
              <option value="">Choose your track...</option>
              {tracks.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-6 col-12 mb-2">
            <p className="text-start mb-1 ml-1">Second Major</p>
            <select
              className="form-select"
              value={secondMajor}
              onChange={(e) => setSecondMajor(e.target.value)}
            >
              <option value="">Choose your second major...</option>
              {secondMajors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-12 mb-2 text-center">
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
