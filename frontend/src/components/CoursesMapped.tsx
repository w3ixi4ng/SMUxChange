import { useState, useEffect } from "react";
import axios from "axios";


type ChildProps = {
    courseArea: string | string[]
    university: string
};

function CoursesMapped({ courseArea, university}: ChildProps) {
    const [courses, setCourses] = useState([]);
    const fetchMappableCourses = async (courseArea: string, university: string) => {
        const response = await axios.get(`http://localhost:3001/database/getByCourseAreaAndUniversity/${courseArea}/${university}`);
        const courses = response.data;
        setCourses(courses);
    }

    useEffect(() => {
        fetchMappableCourses(courseArea[1], university);
        setSelectedCount(0);
    }, [courseArea, university]);

    const [selectedCount, setSelectedCount] = useState(0);
    const maxCount = parseInt(courseArea[0]);

    return (
        <>
            {courses.length > 0 &&
                <div className="container col-12 mx-auto bg-blue-100 py-3 rounded shadow-md font-semibold mb-3">
                    <div className="flex justify-between">
                        <h1>{courseArea[1]}</h1>
                        <h3><span className="badge text-bg-secondary">{selectedCount}/{courseArea[0]}</span></h3>
                    </div>
                    {courses.map((course: any) => (
                        <div key={course['Course Title']} className="display-flex justify-between" id={course['Course Title']}>
                            <h4><span className={`text-wrap text-start badge text-bg-dark hover:cursor-pointer`} onClick={() => {setSelectedCount(selectedCount + 1);}}>{course['Course Title']}</span></h4>
                        </div>
                    ))}

                    {selectedCount === maxCount && (
                        <div className="text-center">
                            <h4 className="text-danger">You have selected the maximum number of courses</h4>
                        </div>
                    )}
                </div>
            }
        </>
    )
}

export default CoursesMapped;