import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ExistingMap from "../components/ExistingMap";
import { UpdateProfileAlert } from "@/components/UpdateProfileAlert";
import { User, BookOpen, GraduationCap, Map, SearchX, FileX, MapPin } from "lucide-react";

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

function Profile() {
  const uid = sessionStorage.getItem("uid");
  const backToUrl = sessionStorage.getItem("backToUrl");
  
  const navigate = useNavigate();
  
  
  
  const fetchUser = async (uid: string) => {
    try {
      const response = await axios.get(`https://smuxchange-backend.vercel.app/database/getProfile/${uid}`);
      const user = response.data;
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("faculty", user.faculty);
      sessionStorage.setItem("major", user.major);
      sessionStorage.setItem("track", user.track);
      sessionStorage.setItem("secondMajor", user.secondMajor);
      // update controlled inputs immediately
      setName(user.name || "");
      setFaculty(user.faculty || "");
      setMajor(user.major || "");
      setTrack(user.track || "");
      setSecondMajor(user.secondMajor || "");
      setUserExists(true);
    } catch (error) {
      console.log("API error:", error);
      setUserExists(false);
    }
  };
  
  useEffect(() => {
    fetchUser(uid || "");
  }, [uid]);
  
  useEffect(() => {
    if (!uid) {
      navigate("/login");
    } else {
      if (backToUrl) {
        window.location.href = backToUrl;
      }
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
      setAllTracks(tracks_names.sort());
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
    fetchFaculties();
    fetchSecondMajors();
    if (sessionStorage.getItem("name")) {
      setUserExists(true);
    }

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



  const [savedMaps, setSavedMaps] = useState<any[]>([]);

  const getSavedMaps = async (uid: string) => {
    try {
      const response = await axios.get(`https://smuxchange-backend.vercel.app/database/getSavedMaps/${uid}`);
      setSavedMaps(response.data);
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
      await axios.post('https://smuxchange-backend.vercel.app/database/saveProfile', { uid, name, faculty, major, track, secondMajor });
      // Update sessionStorage after successful save
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("faculty", faculty);
      sessionStorage.setItem("major", major);
      sessionStorage.setItem("track", track);
      sessionStorage.setItem("secondMajor", secondMajor);
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
      {!userExists &&  (
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

          <Modal.Footer>u
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
      {/*<div className={`${userExists ? "relative min-h-screen w-full"
        : ""}`}
        style={{
          backgroundColor: userExists ? "#eeeeee" : undefined,
          color: userExists ? "#102b72" : undefined,
        }}>*/}
        <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
          {/* === Subtle gradient + grid overlay === */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,43,114,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 container mx-auto px-4 py-10" style={{ opacity: userExists ? 1 : 0 }}>
          <div className="text-center mb-10">
            <span className="inline-block ml-2 animate-gif-pulse-profile"><img src="/images/social-page.gif" alt="Profile" className="w-35 h-35 border-2 border-blue-300 rounded-lg shadow-lg" /></span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-none bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: 'inherit' }}>
              <TypingAnimation text="Profile" speed={100} />
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 font-medium max-w-3xl mx-auto">
              Update your profile or update your existing map.
            </p>
          </div>
          <div className="container col-12 mx-auto bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl shadow-lg py-8 px-6 mb-10">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-12 mb-2">
                <p className="mb-1 fw-bold" style={{ color: "#102b72" }}>
                  <User className="w-4 h-4 text-blue-600 d-inline align-middle" /> Name</p>
                <input
                  type="text"
                  className="form-control bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition"
                  style={{ color: "#102b72" }}
                  value={name}
                  placeholder="Enter your name ..."
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                />
              </div>
              <div className="col-lg-6 col-12 mb-2">
                <p className="mb-1 fw-bold" style={{ color: "#102b72" }}>
                  <BookOpen className="w-4 h-4 text-blue-600 d-inline align-middle" /> Faculty</p>
                <select
                  className="form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition"
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
                <p className="mb-1 fw-bold" style={{ color: "#102b72" }}>
                  <GraduationCap className="w-4 h-4 text-blue-600 d-inline align-middle" /> Major</p>
                <select
                  className={`form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition ${toggleMajor ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
                <p className="mb-1 fw-bold" style={{ color: "#102b72" }}>
                  <Map className="w-4 h-4 text-blue-600 d-inline align-middle" /> Track</p>
                <select
                  className={`form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition ${toggleTrack ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
                <p className="mb-1 fw-bold" style={{ color: "#102b72" }}>
                  <GraduationCap className="w-4 h-4 text-blue-600 d-inline align-middle" /> Second Major</p>
                <select
                  className="form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition"
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
            <h2 className="text-center mb-4 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">Your Saved Maps</h2>
            <div className="row justify-content-lg-center justify-content-md-start">
              {savedMaps.map((map) => (
                <ExistingMap key={map.id} mapId={map.id} map={map} setSavedMaps={setSavedMaps} />
              ))}
            </div>
            {savedMaps.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-12 mb-12 w-full">
                <div className="text-center border border-blue-200 border-dashed rounded-xl bg-white/90 backdrop-blur-sm p-14 w-full max-w-[620px] group transition duration-500 hover:duration-200">
                  <div className="flex justify-center isolate">
                    {/* First stacked icon card */}
                    <div className="size-12 bg-white grid place-items-center ring-1 ring-black/[0.08] rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow shadow-lg group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                      <SearchX className="w-5 h-5 text-slate-600" />
                    </div>
                    {/* Second stacked icon card (center) */}
                    <div className="size-12 bg-white grid place-items-center ring-1 ring-black/[0.08] rounded-xl z-10 shadow-lg group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                      <MapPin className="w-5 h-5 text-slate-600" />
                    </div>
                    {/* Third stacked icon card */}
                    <div className="size-12 bg-white grid place-items-center ring-1 ring-black/[0.08] rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                      <FileX className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                  <h2 className="text-base text-slate-800 font-medium mt-6">No Saved Maps Found</h2>
                  <p className="text-sm text-slate-600 mt-1">Start exploring and save your<br />module mappings!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
            
    </>
  );
}

export default Profile;