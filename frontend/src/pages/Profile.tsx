import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ExistingMap from "../components/ExistingMap";
import { UpdateProfileAlert } from "@/components/UpdateProfileAlert";


function Profile() {
  const uid = sessionStorage.getItem("uid");

  const navigate = useNavigate();

  const fetchUser = async (uid: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/database/getProfile/${uid}`);
      const user = response.data;

      setUserExists(true);
      setName(user.name);
      setFaculty(user.faculty);
      setMajor(user.major);
      setTrack(user.track);
      setSecondMajor(user.secondMajor);
    } catch (error) {
      console.log("API error:", error);
      setUserExists(false);
    }
  };


  useEffect(() => {
    if (!uid) {
      navigate("/login");
    } else {
      fetchUser(uid);
      getSavedMaps(uid);
    }
  }, []);


  const [userExists, setUserExists] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

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

  useEffect(() => {
    if (userExists) {
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("faculty", faculty);
      sessionStorage.setItem("major", major);
      sessionStorage.setItem("track", track);
      sessionStorage.setItem("secondMajor", secondMajor);

    }
  }, [userExists, name, faculty, major, track, secondMajor]);


  const [savedMaps, setSavedMaps] = useState<any[]>([]);

  const getSavedMaps = async (uid: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/database/getSavedMaps/${uid}`);
      setSavedMaps(response.data);
      console.log(response.data);
    }
    catch (error) {
      console.log("API error getting saved maps:", error);
    }
  }


  const saveProfile = async (uid: any, name: string, faculty: string, major: string, track: string, secondMajor: string) => {
    let errors = [];
    if (name === "") {
      errors.push("Name is required");
    }
    if (faculty === "") {
      errors.push("Faculty is required");
    }
    if (major === "") {
      errors.push("Major is required");

    }
    if (errors.length > 0) {
      setErrorMessage(errors);
      return;
    }

    try {
      await axios.post('http://localhost:3001/database/saveProfile', { uid, name, faculty, major, track, secondMajor });
      setUserExists(true);
      setErrorMessage([]);
    } catch (error) {
      console.log("API error saving profile:", error);
    }
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
      {!userExists && (
        <Modal
          show={!userExists}
          size="lg"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header >
            <Modal.Title> Fill in your profile to continue</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="container col-12 mx-auto py-3">
              <div className="row justify-content-center">
                <div className="col-lg-6 col-12 mb-2">
                  <p className="text-start mb-1 ml-1">Name</p>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    placeholder="Enter your name ..."
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
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
                  <p className="text-start mb-1 ml-1">Track (Optional)</p>
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
                  <p className="text-start mb-1 ml-1">Second Major (Optional)</p>
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
            </div>
          </Modal.Body>

          <Modal.Footer>
            {errorMessage.length > 0 && (
              <div className="col-12 mb-2 text-center">
                {errorMessage.map((error) => (
                  <p className="text-danger">{error}</p>
                ))}
              </div>
            )}
            <div className="col-12 mb-2 text-center">
              <Button variant="secondary" className="btn-primary" onClick={() => saveProfile(uid || "", name, faculty, major, track, secondMajor)}>
                Save Profile
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
      <div className={`${userExists ? "relative min-h-screen w-full"
        : "bg-black min-h-screen w-full"}`}
        style={{
          backgroundColor: userExists ? "#eeeeee" : undefined,
          color: userExists ? "#102b72" : undefined,
        }}>
        {/* === Subtle gradient + grid overlay === */}
        {userExists && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,43,114,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </>
        )}
        <div className="relative z-10 container mx-auto px-4 py-10" style={{ opacity: userExists ? 1 : 0 }}>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#102b72" }}>Profile</h1>
            <p className="text-sm" style={{ color: "#102b72" }}>
              Update your profile or update your existing map.
            </p>
          </div>
          <div className="container col-12 mx-auto bg-white/80 backdrop-blur-md border border-[#102b72]/20 rounded-2xl shadow-lg py-8 px-6 mb-10">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-12 mb-2">
                <p className="mb-1 font-bold" style={{ color: "#102b72" }}>Name</p>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  placeholder="Enter your name ..."
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                />
              </div>
              <div className="col-lg-6 col-12 mb-2">
                <p className="mb-1 font-bold" style={{ color: "#102b72" }}>Faculty</p>
                <select
                  className="form-select"
                  style={{ color: "#102b72" }}
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
                <p className="mb-1 font-bold" style={{ color: "#102b72" }}>Major</p>
                <select
                  className="form-select"
                  style={{ color: "#102b72" }}
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
                <p className="mb-1 font-bold" style={{ color: "#102b72" }}>Track</p>
                <select
                  className="form-select"
                  style={{ color: "#102b72" }}
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
                <p className="mb-1 font-bold" style={{ color: "#102b72" }}>Second Major</p>
                <select
                  className="form-select"
                  style={{ color: "#102b72" }}
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
            {errorMessage.length > 0 && (
              <div className="col-12 mb-2 text-center">
                {errorMessage.map((error) => (
                  <p className="text-danger">{error}</p>
                ))}
              </div>
            )}
            <div className="col-12 text-center mt-4">
              <UpdateProfileAlert uid={uid || ""} name={name} faculty={faculty} major={major} track={track} secondMajor={secondMajor} setErrorMessage={setErrorMessage} />
            </div>
          </div>
          <div className="container col-12 mx-auto">
            <h2 className="text-center mb-4 text-4xl font-bold" style={{ color: "#102b72" }}>Your Saved Maps</h2>
            <div className="row justify-content-lg-center justify-content-md-start">
              {savedMaps.map((map) => (
                <ExistingMap key={map.id} mapId={map.id} map={map} setSavedMaps={setSavedMaps} />
              ))}
            </div>
            {savedMaps.length === 0 && (
              <div className="col-12 mb-2 text-center">
                <p className="text-sm" style={{ color: "#102b72", opacity: 0.7 }}>No saved maps found. Start exploring!</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
}

export default Profile;