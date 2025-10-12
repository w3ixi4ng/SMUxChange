import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";


type ChildProps = {
    courseArea: string | string[]
    university: string
    setAvailableCourses: (availableCourses: boolean) => void
    onSelectedCoursesChange?: (courseArea: string, selectedCourses: string[]) => void
};

function CoursesMapped({ courseArea, university, setAvailableCourses, onSelectedCoursesChange }: ChildProps) {
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

    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        setIsExpanded(true);
    }, [courseArea]);

    useEffect(() => {
        if (onSelectedCoursesChange) {
            const selectedCoursesList = Object.keys(selectedButtons).filter(course => selectedButtons[course]);
            onSelectedCoursesChange(courseArea[1], selectedCoursesList);
        }
    }, [selectedButtons]);

    return (
        <>
            {courses.length > 0 &&
                <div className="col-lg-12 col-12 bg-blue-100 py-3 rounded shadow-md font-semibold mb-3 ml-2 align-self-start">
                    <div className="d-flex justify-content-start">
                        <div className="col-11">
                            <h1 className='text-center'>{courseArea[1]}</h1>
                            <h3 className='text-center'><span className="badge text-bg-secondary">{selectedCount}/{courseArea[0]} selected</span></h3>
                        </div>
                        <div className="col-1 text-end fw-bold d-flex justify-content-end">
                            {isExpanded ? 
                            <ChevronUp className="cursor-pointer" onClick={() => {
                                setIsExpanded(!isExpanded)
                            }} /> :
                            <ChevronDown className="cursor-pointer" onClick={() => {
                                setIsExpanded(!isExpanded)
                            }} />}
                        </div>
                    </div>
                    <div className={`row justify-content-center ${isExpanded ? 'd-flex' : 'd-none'}`}>
                    <hr />
                        {courses.map((course: any) => (
                            <div key={course['Course Title']} className="d-flex justify-content-between mb-2 col-lg-4 col-md-4 col-4" id={course['Course Title']}>
                                <button className={`text-wrap text-start badge hover:cursor-pointer h-100 w-100 text-wrap overflow-hidden text-center
                                ${!selectedButtons[course['Course Title']] && !isDisabled ? 'bg-primary' : ''}
                                ${selectedButtons[course['Course Title']] ? 'bg-success' : ''}
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