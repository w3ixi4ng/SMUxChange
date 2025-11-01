import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import ExistingCourseMap from "./ExistingCourseMap";

type ChildProps = {
  map: any
  setSelectedCourses: (courses: any) => void
  selectedCourses: any
}


function UpdateExistingMap({ map, setSelectedCourses, selectedCourses }: ChildProps) {

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
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedMapCourseAreas, setSelectedMapCourseAreas] = useState<string[]>([]);
  const [availableCourseAreasList, setAvailableCourseAreasList] = useState<string[]>([]);

  const fetchSchoolCores = async (faculty: string, major: string, track: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/database/getTracksByMajor/${faculty}`);
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
      const response = await axios.get(`http://localhost:3001/database/getAllFaculty`);
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
    fetchSchoolCores(map.faculty, map.major, map.track);
  }, [map.faculty, map.major, map.track]);

  useEffect(() => {
    fetchSecondMajors(map.secondMajor);
  }, [map.secondMajor])

  // Initialize selectedCourses from existing map data when component mounts
  useEffect(() => {
    if (map && map.map) {
      setSelectedCourses(map.map);
      const initialCount = Object.values(map.map).reduce((acc: number, curr: any) => {
        if (curr && curr.courses) {
          return acc + curr.courses.length;
        }
        return acc;
      }, 0);
      setSelectedCount(initialCount);
      
      // Initialize selectedMapCourseAreas with course areas that have courses
      const areasWithCourses = Object.keys(map.map).filter((area: string) => {
        return map.map[area].courses && map.map[area].courses.length > 0;
      });
      setSelectedMapCourseAreas(areasWithCourses);
    }
  }, []);

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
  }, [schoolCourses, majorElectives, trackElectives, secondMajorElectives, map.secondMajor]);

    useEffect(() => {
      setSelectedCount(Object.values(selectedCourses).reduce((acc: number, curr: any) => acc + curr.courses.length, 0));
    }, [selectedCourses]);

  const maxCount = 5;





  useEffect(() => {
    if (selectedCount >= maxCount) {
      toast("You have reached the maximum number of courses selected (5).");
    }
  }, [selectedCount]);

  
  
  
  return (
    // Dark theme wrapper, replaces light container and default bootstrap spacing
    <div className="container mx-auto text-white my-10 mt-0">

      {/* Replaced Bootstrap row with responsive grid */}
      <div className="row gap-6">
        {/* === LEFT PANEL (Your Map) === */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-lg">
          <div className="flex justify-between items-center row">
            <h2 className="text-xl mb-2 font-semibold col-12 text-center font-bold">Your Map</h2>

          </div>
          <p className="text-gray-400 mb-4">{selectedCount}/{maxCount} selected</p>

          {/* Empty state message styled to match dark background */}
          {selectedCount === 0 ? (
            <div className="text-gray-500 italic">No courses selected</div>
          ) : (
            Object.keys(selectedCourses).map((area: string) => (
              selectedCourses[area].courses.length > 0 && (
                <div key={area} className="mb-4">
                  <h3 className="font-semibold text-gray-200">{area}</h3>
                  <ul className="text-gray-400 list-disc list-inside">
                    {selectedCourses[area].courses.map((course: any) => (
                      <li key={course}>{course}</li>
                    ))}
                  </ul>
                </div>
              )
            ))
          )}
          {uid != "" && (
            <div className="col-12 text-center mt-2">
              <button onClick={() => {
                setSelectedCourses(Object.fromEntries(Object.entries(selectedCourses).filter(([key, _]: [string, any]) => key != "undefined")));
                toast("Map updated successfully", {
                  description: "The map has been updated.",
                });
              }}
                className={`bg-white text-black font-semibold hover:bg-gray-200 hover:scale-105 px-8 py-2 text-lg rounded-full shadow-lg rounded cursor-pointer`}>
                Update Map
              </button>
            </div>
          )}
        </div>

        {/* === RIGHT PANEL (Available Courses) === */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-lg">
          <h2 className="text-xl mb-4 font-semibold text-center">Available Courses</h2>
          <div className="text-center mb-4">
            <select
              className="w-50 mx-auto form-select bg-white text-black border border-white/20 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-gray-300 transition"
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
            <ExistingCourseMap
              map={map}
              key={`${elective[1]}-${index}`}
              courseArea={elective}
              university={map.university}
              setAvailableCourses={setAvailableCourses}
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

export default UpdateExistingMap;