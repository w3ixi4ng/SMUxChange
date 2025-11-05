import { useState, useEffect } from "react";
import CoursesMapped from "./CoursesMapped";
import axios from "axios";
import { toast } from "sonner";
import { BookOpen, SearchX, FileX, GraduationCap, Info, Save } from "lucide-react";
import { Link } from "react-router-dom";


type ChildProps = {
  university: string,
  country: string,
  faculty: string,
  major: string,
  track: string,
  secondMajor: string
};


function MapResults({ university, country, faculty, major, track, secondMajor }: ChildProps) {


  const [uid, setUid] = useState<string>("");
  const [selectedCourseArea, setSelectedCourseArea] = useState<string>("");
  useEffect(() => {
    setUid(sessionStorage.getItem('uid') || "");
  }, []);

  const [schoolCourses, setSchoolCourses] = useState<string[][]>([]);
  const [majorElectives, setMajorElectives] = useState<any>(null);
  const [trackElectives, setTrackElectives] = useState<string[]>([]);
  const [secondMajorElectives, setSecondMajorElectives] = useState<string>("");

  const [availableCourses, setAvailableCourses] = useState<boolean>(false);
  const [selectedCourses, setSelectedCourses] = useState<{ [courseArea: string]: { limit: number, courses: string[] } }>({});

  const fetchSchoolCores = async (faculty: string, major: string, track: string) => {
    try {
      const response = await axios.get(`https://smuxchange-backend.vercel.app/database/getTracksByMajor/${faculty}`);
      const mapable_mods = JSON.parse(response.data[0].Mappable);
      let major_electives = mapable_mods[0]['Majors']['First Major'][major]['Major Elective'];
      setMajorElectives(major_electives);
      let records = [] as string[][];
      let sch_core = mapable_mods[0];
      for (let core in sch_core) {

        let temp = []
        if (core == "Free Elective") {
          let fac_abbr = response.data[0].Faculty;
          temp.push(sch_core[core], `${fac_abbr} Free Elective`);
          records.push(temp);
        }
        else if (core != "Majors") {
          temp.push(sch_core[core], core);
          records.push(temp);
        }
      }
      setSchoolCourses(records);

      if (track != "") {
        const mapable_mods = JSON.parse(response.data[0].Mappable);
        let track_electives = mapable_mods[0]['Majors']['First Major'][major]['Track'][track];
        setTrackElectives([track_electives, track]);
      } else {
        setTrackElectives([]);
      }
    }
    catch (error) {
      console.log("API error:", error);
    }
  }


  const fetchSecondMajors = async (secondMajor: string) => {
    try {
      const response = await axios.get(`https://smuxchange-backend.vercel.app/database/getAllFaculty`);
      const faculty = response.data;
      let records = {} as { [key: string]: string };
      for (let f of faculty) {
        let mappable_mods = JSON.parse(f.Mappable);
        if (mappable_mods[0].Majors['Second Major']) {
          let second_major_obj = mappable_mods[0].Majors['Second Major'];
          for (let second_major in second_major_obj) {
            records[second_major] = second_major_obj[second_major]['Major Elective'];
          }

        }
      }
      if (secondMajor != "") {
        setSecondMajorElectives(records[secondMajor]);
      }
    }
    catch (error) {
      console.log("API error:", error);
    }
  }

  useEffect(() => {
    fetchSchoolCores(faculty, major, track);
  }, [university, faculty, major, track, secondMajor, country]);

  useEffect(() => {
    fetchSecondMajors(secondMajor);
  }, [university, secondMajor, faculty, major, track, country])

  useEffect(() => {
    setSelectedCourses({});
    setSelectedCount(0);
    setAvailableCourseAreasList([]);
  }, [university, faculty, major, track, secondMajor, country]);

  const handleSelectedCoursesChange = (courseArea: string, courseAreaLimit: number, selectedCoursesList: string[]) => {
    setSelectedCourses((prev: { [courseArea: string]: { limit: number, courses: string[] } }) => ({
      ...prev,
      [courseArea]: {
        limit: courseAreaLimit,
        courses: selectedCoursesList
      }
    }));
  };


  const [allElectives, setAllElectives] = useState<any[]>([]);

  useEffect(() => {
    const allElectivesList: any[] = [];

    if (schoolCourses.length > 0) {
      for (let course of schoolCourses) {
        allElectivesList.push(course);
      }
    }
    if (majorElectives && typeof majorElectives === 'object') {
      Object.values(majorElectives).forEach((value: any) => {
        allElectivesList.push([value[0], value[1]]);
      });
    }
    if (trackElectives.length > 0) {
      allElectivesList.push(trackElectives);
    }
    if (secondMajorElectives != "") {
      allElectivesList.push(secondMajorElectives);
    }

    setAllElectives(allElectivesList);
  }, [schoolCourses, majorElectives, trackElectives, secondMajorElectives, secondMajor]);

  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    setSelectedCount(Object.values(selectedCourses).reduce((acc: number, curr: { limit: number, courses: string[] }) => acc + curr.courses.length, 0));
  }, [selectedCourses]);

  const maxCount = 5;

  const saveMap = async () => {
    try {
      let filteredCourses = Object.fromEntries(Object.entries(selectedCourses).filter(([key, _]) => key != "undefined"));
      await axios.post(`https://smuxchange-backend.vercel.app/database/saveMap`, {
        uid: uid,
        country: country,
        university: university,
        faculty: faculty,
        major: major,
        track: track,
        secondMajor: secondMajor,
        map: filteredCourses
      });
      await getSavedMaps();
    }
    catch (error) {
      console.log("API error:", error);
    }
  }

  const [saveMapDisabled, setSaveMapDisabled] = useState(false);
  const [savedMaps, setSavedMaps] = useState<any[]>([]);

  const getSavedMaps = async () => {
    try {
      const response = await axios.get(`https://smuxchange-backend.vercel.app/database/getSavedMaps/${uid}`);
      setSavedMaps(response.data);
    }
    catch (error) {
      console.log("API error:", error);
    }
  };

  useEffect(() => {
    if (uid != "") {
      getSavedMaps();
    }
  }, [uid]);


  useEffect(() => {
    if (savedMaps.length >= 3) {
      setSaveMapDisabled(true);
    }
  }, [savedMaps]);

  const [selectedMapCourseAreas, setSelectedMapCourseAreas] = useState<string[]>([]);
  const [availableCourseAreasList, setAvailableCourseAreasList] = useState<string[]>([]);

  // Update availableCourses based on whether any course areas have courses
  useEffect(() => {
    setAvailableCourses(availableCourseAreasList.length > 0);
  }, [availableCourseAreasList]);

  // Delay showing empty-state message by 2 seconds after inputs change
  const [showEmpty, setShowEmpty] = useState(false);
  useEffect(() => {
    setShowEmpty(false);
    const t = setTimeout(() => setShowEmpty(true), 1500);
    return () => clearTimeout(t);
  }, [university, faculty, major, track, secondMajor, country]);

  useEffect(() => {
    if (selectedCount >= maxCount) {
      toast("You have reached the maximum number of courses selected (5).");
    }
  }, [selectedCount]);


  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const end = document.getElementById("results-end");
      if (end) end.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [availableCourses, allElectives.length, availableCourseAreasList.length, faculty, country, track, major, university, secondMajor]);


  return (
      <div className="container mx-auto my-10 px-6" style={{ color: "#102b72" }}>
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">{university}</h1>
        <Link to={`/specifics/${university}`}>
          <button className="group relative overflow-hidden bg-blue-600 text-white font-bold px-8 py-2 text-lg rounded shadow-2xl transition-all duration-300 hover:shadow-blue-500/50 hover:bg-blue-700 animate-jump-hover">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Info className="w-5 h-5" />
              More Info
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
        </Link>
      </div>

      {/* Error message (delayed) */}
      <div id="results-end" />
      {showEmpty && !availableCourses && (
        <div className="flex flex-col items-center justify-center mt-12 mb-12">
          <div className="text-center border border-blue-200 border-dashed rounded-xl bg-white/90 backdrop-blur-sm p-14 w-full max-w-[620px] group transition duration-500 hover:duration-200">
            <div className="flex justify-center isolate">
              {/* First stacked icon card */}
              <div className="size-12 bg-white grid place-items-center ring-1 ring-black/[0.08] rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow shadow-lg group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <SearchX className="w-5 h-5 text-slate-600" />
              </div>
              {/* Second stacked icon card (center) */}
              <div className="size-12 bg-white grid place-items-center ring-1 ring-black/[0.08] rounded-xl z-10 shadow-lg group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <GraduationCap className="w-5 h-5 text-slate-600" />
              </div>
              {/* Third stacked icon card */}
              <div className="size-12 bg-white grid place-items-center ring-1 ring-black/[0.08] rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <FileX className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <h2 className="text-base text-slate-800 font-medium mt-6">No Courses Available</h2>
            <p className="text-sm text-slate-600 mt-1">Find out more from the host university<br />above.</p>
          </div>
        </div>
      )}


  {/* Split Layout: 30% / 70% */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6 ${
          availableCourses ? "" : "hidden"
        }`}
      >
        {/* LEFT PANEL — Your Map (30%) */}
        <div className="bg-white/80 backdrop-blur-lg border border-indigo-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 align-middle" style={{ color: "#102b72" }} />
            <h2 className="text-2xl font-semibold" style={{ color: "#102b72" }}>Your Map</h2>
          </div>

          {saveMapDisabled && (
            <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-lg">
              <p className="text-amber-700 text-sm text-center">You have reached the maximum number of maps allowed. Delete or update your existing maps to save more.</p>
            </div>
          )}

          <p className="mb-6" style={{ color: "#102b72" }}>{selectedCount}/{maxCount} selected</p>

          {/* Empty state message */}
          {selectedCount === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <BookOpen className="w-12 h-12" style={{ color: "#102b72", opacity: 0.5 }} />
                <p className="italic text-lg" style={{ color: "#102b72", opacity: 0.7 }}>No courses selected</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(selectedCourses).map((area) => (
                selectedCourses[area].courses.length > 0 && (
                  <div key={area} className="bg-white border border-indigo-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-[#102b72]/20" style={{ color: "#102b72" }}>
                      {area}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourses[area].courses.map((course: string) => (
                        <span
                          key={course}
                          className="px-3 py-1.5 rounded-lg text-sm border border-indigo-200 hover:bg-indigo-50 transition-colors text-slate-700"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {uid != "" && (
            <div className="text-center mt-8">
              <button onClick={() => {
                saveMap();
                toast.success("Map saved successfully", {
                  description: "The map has been saved to your profile.",
                });
              }}
                disabled={saveMapDisabled}
                className={`group relative overflow-hidden font-bold px-8 py-2 text-lg rounded shadow-2xl transition-all duration-300 ${saveMapDisabled ? "opacity-50 cursor-not-allowed bg-gray-400" : "bg-blue-600 text-white hover:shadow-blue-500/50 hover:bg-blue-700 animate-jump-hover"}`}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Map
                </span>
                {!saveMapDisabled && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Available Courses (70%) */}
        <div className="bg-white/80 backdrop-blur-lg border border-indigo-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl mb-4 font-semibold text-center" style={{ color: "#102b72" }}>Available Courses</h2>
          <div className="text-center mb-4">
            <select
              className="w-full mx-auto form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition"
              style={{ color: "#102b72" }}
              onChange={(e) => setSelectedCourseArea(e.target.value)}
            >
              <option value="">Select a course area...</option>
              {availableCourseAreasList.map((courseArea, index) => (
                <option key={`${courseArea}-${index}`} value={courseArea}

                >
                  {courseArea}
                  {selectedMapCourseAreas.includes(courseArea) && <span className="text-green-500"> (Courses Selected)</span>}
                </option>
              ))}
            </select>
          </div>
          {allElectives.map((elective, index) => (
            <CoursesMapped
              key={`${elective[1]}-${index}`}
              courseArea={elective}
              university={university}
              onSelectedCoursesChange={handleSelectedCoursesChange}
              selectedTotalCount={selectedCount}
              maxTotalCount={maxCount}
              selectedCourseArea={selectedCourseArea}
              setSelectedMapCourseAreas={setSelectedMapCourseAreas}
              setAvailableCourseAreasList={setAvailableCourseAreasList}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MapResults