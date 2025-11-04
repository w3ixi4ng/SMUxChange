import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import ExistingCourseMap from "./ExistingCourseMap";
import { BookOpen } from "lucide-react";

type ChildProps = {
  map: any
  setSelectedCourses: (courses: any) => void
  selectedCourses: any
}


function UpdateExistingMap({ map, setSelectedCourses, selectedCourses }: ChildProps) {

  const [selectedCourseArea, setSelectedCourseArea] = useState<string>("");

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
      const response = await axios.get(`http://54.206.13.109:3001/database/getTracksByMajor/${faculty}`);
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
      const response = await axios.get(`http://54.206.13.109:3001/database/getAllFaculty`);
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
    <div className="container mx-auto my-10 mt-0" style={{ color: "#102b72" }}>

      {/* Replaced Bootstrap row with responsive grid */}
      <div className="row gap-6">
        {/* === LEFT PANEL (Your Map) === */}
        <div className="bg-white/80 backdrop-blur-md border border-[#102b72]/20 rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6" style={{ color: "#102b72" }} />
            <h2 className="text-2xl font-semibold" style={{ color: "#102b72" }}>Your Map</h2>
          </div>

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
              {Object.keys(selectedCourses).map((area: string) => (
                selectedCourses[area].courses.length > 0 && (
                  <div key={area} className="bg-white border border-[#102b72]/20 rounded-xl p-5">
                    <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-[#102b72]/20" style={{ color: "#102b72" }}>
                      {area}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourses[area].courses.map((course: any) => (
                        <span
                          key={course}
                          className="px-3 py-1.5 rounded-lg text-sm border border-[#102b72]/30 hover:bg-[#102b72]/10 transition-colors"
                          style={{ color: "#102b72", backgroundColor: "white" }}
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
        </div>

        {/* === RIGHT PANEL (Available Courses) === */}
        <div className="bg-white/80 backdrop-blur-md border border-[#102b72]/20 rounded-3xl p-5 shadow-lg">
          <h2 className="text-xl mb-4 font-semibold text-center" style={{ color: "#102b72" }}>Available Courses</h2>
          {/* Use availableCourses to avoid unused warning and show helpful feedback */}
          {!availableCourses && (
            <div className="text-center mt-2 bg-amber-50 border border-amber-200 text-amber-700 py-2 rounded-lg text-sm">
              No courses mapped before for this school.
            </div>
          )}
          <div className="text-center mb-4">
            <select
              className="w-50 mx-auto form-select bg-white border border-[#102b72]/30 rounded-lg hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-[#102b72] transition"
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