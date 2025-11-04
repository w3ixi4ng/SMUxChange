import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react"; //  removed Infinity import (unused)


type ChildProps = {
    courseArea: string | string[]
    university: string
    onSelectedCoursesChange?: (courseAreaName: string , courseAreaLimit: number , selectedCourses: string[]) => void
    selectedTotalCount: number
    maxTotalCount: number
    selectedCourseArea: string
    setSelectedMapCourseAreas: React.Dispatch<React.SetStateAction<string[]>>
    setAvailableCourseAreasList: React.Dispatch<React.SetStateAction<string[]>>
    map: any
};

function ExistingCourseMap({ courseArea, university, onSelectedCoursesChange, selectedTotalCount, maxTotalCount, selectedCourseArea, setSelectedMapCourseAreas, setAvailableCourseAreasList, map }: ChildProps) {
    const [courses, setCourses] = useState([]);

    const fetchMappableCourses = async (courseArea: string, university: string) => {
        const response = await axios.get(`http://54.206.13.109:3001/database/getByCourseAreaAndUniversity/${courseArea}/${university}`);
        const courses = response.data;
        setCourses(courses);
        if (courses.length > 0) {
            setAvailableCourseAreasList((prev: string[]) => 
              !prev.includes(courseArea) ? [...prev, courseArea] : prev
            );
            
        }
    }

    const [selectedCount, setSelectedCount] = useState(0);
    const maxCount = parseInt(courseArea[0]);

    const [selectedButtons, setSelectedButtons] = useState<{ [key: string]: boolean }>({});
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        fetchMappableCourses(courseArea[1], university);
    }, [courseArea, university]);

    useEffect(() => {
        // Initialize selected buttons from existing map data if available
        if (map && map.map && map.map[courseArea[1]] && courses.length > 0) {
            const existingCourses = map.map[courseArea[1]].courses;
            const initialSelected: { [key: string]: boolean } = {};
            existingCourses.forEach((courseTitle: string) => {
                initialSelected[courseTitle] = true;
            });
            setSelectedButtons(initialSelected);
            setSelectedCount(existingCourses.length);
        } else {
            setSelectedButtons({});
            setSelectedCount(0);
        }
    }, [courseArea, university, courses]);

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
            onSelectedCoursesChange(courseArea[1], parseInt(courseArea[0]), selectedCoursesList);
            
            // Update selectedMapCourseAreas based on whether any courses are selected
            if (selectedCoursesList.length > 0) {
                // Add course area if it has selected courses
                setSelectedMapCourseAreas((prev: string[]) => {
                    if (!prev.includes(courseArea[1])) {
                        return [...prev, courseArea[1]];
                    }
                    return prev;
                });
            } else {
                // Remove course area if no courses are selected
                setSelectedMapCourseAreas((prev: string[]) => prev.filter(area => area !== courseArea[1]));
            }
        }
    }, [selectedButtons]);

 //  EVERYTHING BELOW THIS COMMENT changes
  //      Replace your existing JSX return() section with the following modern version.
  //      Do NOT change any logic above this point.
  return (
    <>
    
      {courses.length > 0 && selectedCourseArea === courseArea[1] && (
        // Outer container: light theme card
        <div className="col-lg-12 col-12 bg-white/80 backdrop-blur-md border border-[#102b72]/20 py-4 rounded-3xl shadow-md mb-4">
            {/* === Header Section (centered & highlighted) === */}
            <div className="relative flex flex-col items-center justify-center text-center mb-4">
            {/* Title centered */}
            <h2 className="text-xl font-semibold mb-1 tracking-tight" style={{ color: "#102b72" }}>
                {courseArea[1]}
            </h2>

            {/* Highlighted count below title */}
            <p
                className="text-sm transition-colors duration-300 font-medium"
                style={{ 
                  color: selectedCount > 0 ? "#102b72" : "#102b72",
                  opacity: selectedCount > 0 ? 1 : 0.7
                }}
            >
                {courseArea[0] === "None"
                ? `${selectedCount} selected (No Limits)`
                : `${selectedCount}/${courseArea[0]} selected`}
            </p>

            {/* Chevron toggle positioned at top-right for aesthetic balance */}
            <div className="absolute top-0 right-3 opacity-70 hover:opacity-100 transition" style={{ color: "#102b72" }}>
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
        className={`grid grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-center items-center mx-2 ${
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
                  className={`h-full text-center rounded-full px-5 py-3 text-sm transition-all duration-200 font-semibold
                    ${
                      selected
                        // Selected: dark blue background with white text
                        ? "shadow-lg"
                        // Default: white background with blue border, smooth hover tint
                        : "bg-white border border-[#102b72]/30 hover:bg-[#102b72]/10 hover:border-[#102b72]/50"
                    }
                    ${
                      isDisabled && !selected
                        // Disabled: faded and non-interactive
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  style={{
                    backgroundColor: selected ? "#102b72" : undefined,
                    color: selected ? "#ffffff" : "#102b72"
                  }}
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
            <div className="text-center mt-3 text-sm" style={{ color: "#dc2626" }}>
              You have selected the maximum number of courses
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ExistingCourseMap;