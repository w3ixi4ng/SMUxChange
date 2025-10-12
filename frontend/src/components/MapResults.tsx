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
    const [allSecondMajors, setAllSecondMajors] = useState<{ [key: string]: string }>({});
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

            setAllSecondMajors(records);
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
        <>
            <div className={`container mx-auto mt-5 mb-1 bg-dark-subtle p-3 rounded-lg ${availableCourses ? "visible" : "hidden"}`}>
                <div className="row align-items-start overflow-visible">
                    <div className="col-lg-6 col-md-4 col-12 mx-auto mb-1 text-center sticky-lg-top sticky-md-top bg">
                        <div className="d-lg-flex justify-content-evenly d-md-block">
                            <h1 className="col-lg-6 col-md-12 col-12">Your Map</h1>
                            <h1 className='col-lg-6 col-md-12 col-12'><span className="badge text-bg-secondary">{selectedCount}/{maxCount} selected</span></h1>
                        </div>
                        <div id="your-map" className="container mx-auto mb-1">
                            {selectedCount == 0 ? <div className="row d-flex justify-content-center bg-dark border border-gray-300 rounded-lg p-3 text-white">No courses selected</div> : null}
                            <div className={`bg-dark border border-gray-300 rounded-lg p-3 text-white ${selectedCount > 0 ? 'visible' : 'invisible'}`}>
                                {Object.keys(selectedCourses).map((courseArea) => (
                                    selectedCourses[courseArea].length > 0 && (
                                        <>
                                            <div key={courseArea}>
                                                <h3>{courseArea}</h3>
                                                {selectedCourses[courseArea].map(course => (
                                                    <div key={course} className="">
                                                        {course}
                                                    </div>
                                                ))}
                                            </div>
                                            <hr />
                                        </>
                                    )

                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-8 col-12 mx-auto mb-1 text-center">
                        <h1>Available Courses</h1>
                        <div id="courses-mapped" className="container mx-auto mb-1">
                            <div className="row d-flex justify-content-center">
                                {allElectives.map((elective) => (
                                    <CoursesMapped key={elective[1]} courseArea={elective} university={university} setAvailableCourses={setAvailableCourses} onSelectedCoursesChange={handleSelectedCoursesChange} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                id="error-message"
                className={`text-center container col-12 mx-auto bg-red-100 py-3 rounded shadow-md font-semibold ${!availableCourses ? "visible" : "hidden"
                    }`}>
                {errorMessage} 
            </div>


        </>
    )
}

export default MapResults;