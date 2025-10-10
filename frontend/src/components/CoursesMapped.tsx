import { useState, useEffect } from "react";
import axios from "axios";


type ChildProps = {
    courseArea: string | string[]
    university: string
    setAvailableCourses: (availableCourses: boolean) => void
};

function CoursesMapped({ courseArea, university, setAvailableCourses}: ChildProps) {
    const [courses, setCourses] = useState([]);

    const fetchMappableCourses = async (courseArea: string, university: string) => {
        const response = await axios.get(`http://localhost:3001/database/getByCourseAreaAndUniversity/${courseArea}/${university}`);
        const courses = response.data;
        setCourses(courses);
        if (courses.length > 0) {
            setAvailableCourses(true);
        }
    }
    
    useEffect(() => {
        fetchMappableCourses(courseArea[1], university);
        setSelectedCount(0);
    }, [courseArea, university]);

    
    const [selectedCount, setSelectedCount] = useState(0);
    const maxCount = parseInt(courseArea[0]);

    const [selectedButtons, setSelectedButtons] = useState<{ [key: string]: boolean }>({});
    const [isDisabled, setIsDisabled] = useState(false);


    useEffect(() => {
        setSelectedButtons({});
    }, [courseArea, university]);

    useEffect(() => {
        if (selectedCount >= maxCount) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [selectedCount]);

    return (
        <>
            {courses.length > 0 &&
                <div className="col-lg-6 col-12 bg-blue-100 py-3 rounded shadow-md font-semibold mb-3 mx-auto">
                    <div className="flex justify-between text-center">
                        <h1>{courseArea[1]}</h1>
                        <h3><span className="badge text-bg-secondary">{selectedCount}/{courseArea[0]}</span></h3>
                    </div>
                    <hr />
                    <div className="row">
                        {courses.map((course: any) => (
                            <div key={course['Course Title']} className="d-flex justify-content-between mb-2 col-lg-4 col-md-6 col-12" id={course['Course Title']}>
                                <button className={`text-wrap text-start badge hover:cursor-pointer h-100 w-100
                                ${!selectedButtons[course['Course Title']] && !isDisabled ? 'bg-dark bg-gradient' : ''}
                                ${selectedButtons[course['Course Title']] ? 'bg-success ' : ''}
                                ${!selectedButtons[course['Course Title']] && isDisabled ? 'bg-danger' : ''}`}
                                disabled={isDisabled && !selectedButtons[course['Course Title']] ? true : false}
                                onClick={() => { 
                                    setSelectedButtons(prev => ({
                                        ...prev,
                                        [course['Course Title']]: !prev[course['Course Title']],
                                    }));
                                    (selectedButtons[course['Course Title']] ? setSelectedCount(prev => prev - 1) : setSelectedCount(prev => prev + 1));
                                }}>{course['Course Title']}</button>
                                
                            </div>
                        ))}
                    </div>

                    {selectedCount >= maxCount && (
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