import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react"; //  removed Infinity import (unused)


type ChildProps = {
    courseArea: string | string[]
    university: string
    setAvailableCourses: (availableCourses: boolean) => void
    onSelectedCoursesChange?: (courseArea: string, selectedCourses: string[]) => void
    selectedTotalCount: number
    maxTotalCount: number
};

function CoursesMapped({ courseArea, university, setAvailableCourses, onSelectedCoursesChange, selectedTotalCount, maxTotalCount }: ChildProps) {
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
        if (selectedCount >= maxCount || selectedTotalCount >= maxTotalCount) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [selectedCount, selectedTotalCount, maxTotalCount]);

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

 //  EVERYTHING BELOW THIS COMMENT changes
  //      Replace your existing JSX return() section with the following modern version.
  //      Do NOT change any logic above this point.
  return (
    <>
      {courses.length > 0 && (
        // Outer container: changed to dark translucent card
        <div className="col-lg-12 col-12 bg-white/5 backdrop-blur-md border border-white/10 text-white py-4 rounded-3xl shadow-md mb-4">
            {/* === Header Section (centered & highlighted) === */}
            <div className="relative flex flex-col items-center justify-center text-center mb-4">
            {/* Title centered */}
            <h2 className="text-xl font-semibold text-white mb-1 tracking-tight">
                {courseArea[1]}
            </h2>

            {/* Highlighted count below title */}
            <p
                className={`text-sm transition-colors duration-300 ${
                selectedCount > 0
                    ? "text-amber-400 font-medium" // Amber highlight when items selected
                    : "text-gray-400 font-light"   // Subtle gray when none selected
                }`}
            >
                {courseArea[0] === "None"
                ? `${selectedCount} selected (No Limits)`
                : `${selectedCount}/${courseArea[0]} selected`}
            </p>

            {/* Chevron toggle positioned at top-right for aesthetic balance */}
            <div className="absolute top-0 right-3 opacity-70 hover:opacity-100 transition">
                {isExpanded ? (
                <ChevronUp
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="cursor-pointer"
                />
                ) : (
                <ChevronDown
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="cursor-pointer"
                />
                )}
            </div>
            </div>

        {/* === Pill Container (flex-based for natural wrapping) === */}
        {/* Switched from grid → flex-wrap to make pill sizes auto-fit instead of rigid squares */}
        <div
        className={`flex flex-wrap gap-2 justify-center items-center ${
            isExpanded ? "visible" : "hidden"
        }`}
        >
        {courses.map((course: any) => {
            const title = course["Course Title"];
            const selected = selectedButtons[title];

            return (
                <button
                  key={title}
                  // New layout: pills now span most of container width, centered horizontally
                  className={`w-full max-w-[90%] text-center rounded-full px-5 py-3 text-sm transition-all duration-200 
                    ${
                      selected
                        // Selected: bright white with glow for focus
                        ? "bg-white text-black font-semibold shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                        // Default: transparent with white border, smooth hover tint
                        : "bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40"
                    }
                    ${
                      isDisabled && !selected
                        // Disabled: faded and non-interactive
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  disabled={isDisabled && !selected}
                  onClick={() => {
                    // Toggle selection + count (unchanged logic)
                    setSelectedButtons((prev) => ({
                      ...prev,
                      [title]: !prev[title],
                    }));
                    setSelectedCount((prev) => (selected ? prev - 1 : prev + 1));
                  }}
                >
                  {/* Text auto-wraps gracefully and stays centered */}
                  <span className="block leading-snug whitespace-normal break-words">
                    {title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* === Limit Message === */}
          {/* Shown only when user hits max course count */}
          {selectedCount >= maxCount && (
            <div className="text-center mt-3 text-red-400 text-sm">
              You have selected the maximum number of courses
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CoursesMapped;