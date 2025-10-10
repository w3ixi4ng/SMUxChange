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
    const errorMessage = "No courses mapped before. Find out more from host university.";

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
    }, [university, faculty, major, track, secondMajor, country]);


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


    return (
        <>
            <div className="container col-12 mx-auto mt-5 mb-1">
                <h1>Available Courses at {university}</h1>
            </div>
            <div id="courses-mapped" className="container mx-auto mt-5 mb-1">
                <div className="row">
                    {allElectives.map((elective) => (
                        <CoursesMapped key={elective[1]} courseArea={elective} university={university} setAvailableCourses={setAvailableCourses}/>
                    ))}
                </div>
            </div>
            <div
                id="error-message"
                className={`container col-12 mx-auto bg-red-100 py-3 rounded shadow-md font-semibold ${
                    !availableCourses ? "visible" : "hidden"
                  }`}
                >
                {errorMessage}
            </div>


        </>
    )
}

export default MapResults;