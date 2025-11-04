import axios from "axios";
import { useEffect, useState } from "react";

type ChildProps = {
    courseArea: string | string[]
    university: string
    map: any
}

export function UpdateCourseMap({ courseArea, university, map }: ChildProps) {
    const [courses, setCourses] = useState([]);

    const fetchMappableCourses = async (courseAreaName: string, university: string) => {
        const response = await axios.get(`https://smuxchange-backend.vercel.app/database/getByCourseAreaAndUniversity/${courseAreaName}/${university}`);
        const courses = response.data;
        setCourses(courses);
    }

    useEffect(() => {
        // Handle both string and array formats
        const courseAreaName = Array.isArray(courseArea) ? courseArea[1] : courseArea;
        fetchMappableCourses(courseAreaName, university);
    }, [courseArea, university]);

    const courseAreaName = Array.isArray(courseArea) ? courseArea[1] : courseArea;
    const courseLimit = Array.isArray(courseArea) ? courseArea[0] : "None";

    const [selectedCount, setSelectedCount] = useState(0);

    useEffect(() => {
        if (map['map'][courseAreaName]) {
            setSelectedCount(map['map'][courseAreaName].courses.length);
        }
        else {
            setSelectedCount(0);
        }
    }, [courseArea, university, map]);
    

    return (
        <>
        {courses.length > 0 && (
            <div className="col-lg-6 bg-white/80 backdrop-blur-md border border-[#102b72]/20 rounded-xl p-4 mb-4">
                <p className="mb-1 font-bold" style={{ color: "#102b72" }}>{courseAreaName}</p>
                <p className="mb-2 text-sm" style={{ color: "#102b72", opacity: 0.7 }}>Selected: {selectedCount}/{courseLimit}</p>
                {courses.map((course: any, index: number) => (
                    <p className="mb-1 text-sm" style={{ color: "#102b72", opacity: 0.8 }} key={index}>{course['Course Title']}</p>
                ))}
            </div>
            )}
        </>
    )
}