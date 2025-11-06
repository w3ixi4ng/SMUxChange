import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import ExistingCourseMap from "./ExistingCourseMap";
import { BookOpen } from "lucide-react";

type ChildProps = {
  map: any;
  setSelectedCourses: (courses: any) => void;
  selectedCourses: any;
};

function UpdateExistingMap({ map, setSelectedCourses, selectedCourses }: ChildProps) {
  const [selectedCourseArea, setSelectedCourseArea] = useState<string>("");
  const [schoolCourses, setSchoolCourses] = useState<string[][]>([]);
  const [majorElectives, setMajorElectives] = useState<any>(null);
  const [trackElectives, setTrackElectives] = useState<string[]>([]);
  const [secondMajorElectives, setSecondMajorElectives] = useState<string>("");

  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedMapCourseAreas, setSelectedMapCourseAreas] = useState<string[]>([]);
  const [availableCourseAreasList, setAvailableCourseAreasList] = useState<string[]>([]);
  const [allElectives, setAllElectives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasShownMaxToast = useRef(false);
  const prevCountRef = useRef(0);

  const maxCount = 5;

  // === FETCH FUNCTIONS ===
  const fetchSchoolCores = async (faculty: string, major: string, track: string) => {
    const response = await axios.get(
      `https://smuxchange-backend.vercel.app/database/getTracksByMajor/${faculty}`
    );
    const mapable_mods = JSON.parse(response.data[0].Mappable);

    const major_electives = mapable_mods[0]["Majors"]["First Major"][major]["Major Elective"];
    setMajorElectives(major_electives);

    const records: string[][] = [];
    const sch_core = mapable_mods[0];

    for (let core in sch_core) {
      const temp: string[] = [];
      if (core === "Free Elective") {
        const fac_abbr = response.data[0].Faculty;
        temp.push(sch_core[core], `${fac_abbr} Free Elective`);
      } else if (core !== "Majors") {
        temp.push(sch_core[core], core);
      }
      if (temp.length) records.push(temp);
    }
    setSchoolCourses(records);

    if (track) {
      const track_electives =
        mapable_mods[0]["Majors"]["First Major"][major]["Track"][track];
      setTrackElectives([track_electives, track]);
    } else {
      setTrackElectives([]);
    }
  };

  const fetchSecondMajors = async (secondMajor: string) => {
    const response = await axios.get(
      `https://smuxchange-backend.vercel.app/database/getAllFaculty`
    );
    const faculty = response.data;
    const records: { [key: string]: string } = {};
    for (let f of faculty) {
      const mappable_mods = JSON.parse(f.Mappable);
      if (mappable_mods[0].Majors["Second Major"]) {
        const second_major_obj = mappable_mods[0].Majors["Second Major"];
        for (let s in second_major_obj) {
          records[s] = second_major_obj[s]["Major Elective"];
        }
      }
    }
    if (secondMajor) setSecondMajorElectives(records[secondMajor]);
  };

  // === INITIAL LOAD ===
  useEffect(() => {
    const loadAll = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchSchoolCores(map.faculty, map.major, map.track),
          fetchSecondMajors(map.secondMajor),
        ]);
      } catch (err) {
        console.error("Error loading map data:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 400);
      }
    };
    loadAll();
  }, [map.faculty, map.major, map.track, map.secondMajor]);

  // === Initialize user's existing map ===
  useEffect(() => {
    if (map?.map) {
      setSelectedCourses(map.map);
      const initialCount = Object.values(map.map).reduce(
        (acc: number, curr: any) => (curr?.courses ? acc + curr.courses.length : acc),
        0
      );
      setSelectedCount(initialCount);
      setSelectedMapCourseAreas(
        Object.keys(map.map).filter((a) => map.map[a].courses?.length > 0)
      );
      // Reset toast flag when map is initialized
      hasShownMaxToast.current = false;
      prevCountRef.current = initialCount;
    }
  }, [map]);

  // === Build all electives ===
  useEffect(() => {
    const arr: any[] = [];
    if (schoolCourses.length) arr.push(...schoolCourses);
    if (majorElectives && typeof majorElectives === "object")
      Object.values(majorElectives).forEach((v: any) => arr.push([v[0], v[1]]));
    if (trackElectives.length) arr.push(trackElectives);
    if (secondMajorElectives) arr.push(secondMajorElectives);
    setAllElectives(arr);
  }, [schoolCourses, majorElectives, trackElectives, secondMajorElectives]);

  // === Count & Limit ===
  useEffect(() => {
    const count = Object.values(selectedCourses).reduce(
      (acc: number, curr: any) => acc + (curr?.courses?.length || 0),
      0
    );
    const prevCount = prevCountRef.current;
    
    // Only show toast when crossing the threshold from below maxCount to exactly maxCount
    // and only if count has actually changed (prevents duplicate toasts)
    if (count !== prevCount) {
      if (count === maxCount && prevCount < maxCount && !hasShownMaxToast.current) {
        toast.info("You have reached the maximum number of courses selected (5).");
        hasShownMaxToast.current = true;
      } else if (count < maxCount) {
        // Reset the flag when count drops below maxCount
        hasShownMaxToast.current = false;
      } else if (count > maxCount) {
        // If somehow count exceeds maxCount, reset flag
        hasShownMaxToast.current = false;
      }
    }
    
    setSelectedCount(count);
    // Update the previous count ref
    prevCountRef.current = count;
  }, [selectedCourses]);

  const handleSelectedCoursesChange = (
    area: string,
    limit: number,
    list: string[]
  ) => {
    setSelectedCourses((prev: any) => ({
      ...prev,
      [area]: { limit, courses: list },
    }));
  };

  // === UI ===
  return (
    <div
      className="w-[92%] max-w-[1300px] mx-auto mt-0 mb-12 transition-opacity duration-500"
      style={{ color: "#102b72", transform: "translateX(-10px)" }}
    >
      {/* === GRID STRUCTURE === */}
      <div className="grid lg:grid-cols-[32%_68%] gap-8 items-stretch w-full min-h-[650px] transition-all duration-300">
        {/* LEFT PANEL */}
        <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col justify-start min-h-[600px]">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">Your Map</h2>
          </div>

          <p className="mb-6 text-[#102b72]">
            {selectedCount}/{maxCount} selected
          </p>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center flex-1 text-[#102b72]/50 animate-pulse">
              <BookOpen className="w-8 h-8 mb-3 opacity-60" />
              <p className="font-medium">Loading your map...</p>
            </div>
          ) : selectedCount === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-12">
              <BookOpen className="w-12 h-12 mb-3 opacity-50 text-[#102b72]" />
              <p className="italic text-lg text-[#102b72]/70">No courses selected</p>
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto">
              {Object.keys(selectedCourses).map(
                (area: string) =>
                  selectedCourses[area].courses.length > 0 && (
                    <div
                      key={area}
                      className="bg-white border border-blue-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                    >
                      <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-blue-200 text-slate-800">
                        {area}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourses[area].courses.map((c: any) => (
                          <span
                            key={c}
                            className="px-3 py-1.5 rounded-lg text-sm border border-indigo-200 hover:bg-indigo-50 transition-colors text-slate-700 bg-white"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col justify-start min-h-[600px]">
          <h2 className="text-xl mb-4 font-semibold text-center text-[#102b72]">
            Available Courses
          </h2>

          <div className="text-center mb-4">
            <select
              className="w-full mx-auto form-select bg-white border border-[#5E9CFF]/60 rounded-lg hover:bg-[#5E9CFF]/10 focus:bg-[#5E9CFF]/10 focus:ring-2 focus:ring-[#5E9CFF] transition text-[#102b72]"
              onChange={(e) => setSelectedCourseArea(e.target.value)}
            >
              <option value="">Select a course area...</option>
              {availableCourseAreasList.map((area, i) => (
                <option key={`${area}-${i}`} value={area}>
                  {area}
                  {selectedMapCourseAreas.includes(area) && " (Courses Selected)"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {allElectives.map((elective, i) => (
              <ExistingCourseMap
                map={map}
                key={`${elective[1]}-${i}`}
                courseArea={elective}
                university={map.university}
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
    </div>
  );
}

export default UpdateExistingMap;

