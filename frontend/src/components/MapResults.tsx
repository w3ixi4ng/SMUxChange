import { useState, useEffect } from "react";
import CoursesMapped from "./CoursesMapped";
import axios from "axios";


type ChildProps = {
    university: string,
    country: string,
    faculty: string,
    major: string,
    track: string,
    secondMajor: string
};


function MapResults({ university, country, faculty, major, track, secondMajor }: ChildProps) {
    const [schoolCourses, setSchoolCourses] = useState<string[][]>([]);
    const [majorElectives, setMajorElectives] = useState<string>("");
    const [trackElectives, setTrackElectives] = useState<string>("");
    const [secondMajorElectives, setSecondMajorElectives] = useState<string>("");
    // const [allSecondMajors, setAllSecondMajors] = useState<{ [key: string]: string }>({});
    const [availableCourses, setAvailableCourses] = useState<boolean>(false);
    const [selectedCourses, setSelectedCourses] = useState<{ [courseArea: string]: string[] }>({});
    const errorMessage = "No courses mapped before. Find out more from host university here.";

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
                setTrackElectives(track_electives);
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

            // setAllSecondMajors(records);
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
        setAvailableCourses(false);
        setSelectedCourses({});
        setSelectedCount(0);
    }, [university, faculty, major, track, secondMajor, country]);

    const handleSelectedCoursesChange = (courseArea: string, selectedCoursesList: string[]) => {
        setSelectedCourses(prev => ({
            ...prev,
            [courseArea]: selectedCoursesList
        }));
    };


    const allElectives = [] as any[];

    if (schoolCourses.length > 0) {
        for (let course of schoolCourses) {
            allElectives.push(course);
        }
    }
    if (majorElectives != "") {
        allElectives.push(majorElectives);
    }
    if (trackElectives != "") {
        allElectives.push(trackElectives);
    }
    if (secondMajor != "") {
        allElectives.push(secondMajorElectives);
    }


    const [selectedCount, setSelectedCount] = useState(0);
    useEffect(() => {
        setSelectedCount(Object.values(selectedCourses).reduce((acc, curr) => acc + curr.length, 0));
    }, [selectedCourses]);

    const maxCount = 5;


    return (
        // Dark theme wrapper, replaces light container and default bootstrap spacing
        <div className="container mx-auto text-white my-10">
          <h1 className="text-3xl font-semibold mb-6 text-center">{university}</h1>
    
          {/* Replaced Bootstrap row with responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* === LEFT PANEL (Your Map) === */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-lg">
              <h2 className="text-xl mb-2 font-semibold">Your Map</h2>
              <p className="text-gray-400 mb-4">{selectedCount}/{maxCount} selected</p>
    
              {/* Empty state message styled to match dark background */}
              {selectedCount === 0 ? (
                <div className="text-gray-500 italic">No courses selected</div>
              ) : (
                Object.keys(selectedCourses).map((area) => (
                    selectedCourses[area].length > 0 && (
                  <div key={area} className="mb-4">
                    <h3 className="font-semibold text-gray-200">{area}</h3>
                    <ul className="text-gray-400 list-disc list-inside">
                      {selectedCourses[area].map((course) => (
                        <li key={course}>{course}</li>
                      ))}
                    </ul>
                  </div>
                  )
                ))
              )}
            </div>
    
            {/* === RIGHT PANEL (Available Courses) === */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-lg">
              <h2 className="text-xl mb-4 font-semibold text-center">Available Courses</h2>
              {allElectives.map((elective) => (
                <CoursesMapped
                  key={elective[1]}
                  courseArea={elective}
                  university={university}
                  setAvailableCourses={setAvailableCourses}
                  onSelectedCoursesChange={handleSelectedCoursesChange}
                  selectedTotalCount={selectedCount}
                  maxTotalCount={maxCount}
                />
              ))}
            </div>
          </div>
    
          {/* Error message restyled to blend into dark aesthetic */}
          {!availableCourses && (
            <div className="text-center mt-8 bg-red-500/10 border border-red-500/30 text-red-300 py-3 rounded-lg font-semibold">
              No courses mapped before. Find out more from the host university here.
            </div>
          )}
        </div>
      );
    }
    
    export default MapResults;