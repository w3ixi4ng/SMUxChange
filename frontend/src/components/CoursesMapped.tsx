import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react"; //  removed Infinity import (unused)




type ChildProps = {
   courseArea: string | string[]
   university: string
   setAvailableCourses?: (availableCourses: boolean) => void
   onSelectedCoursesChange?: (courseAreaName: string , courseAreaLimit: number , selectedCourses: string[]) => void
   selectedTotalCount: number
   maxTotalCount: number
   selectedCourseArea: string
   setSelectedMapCourseAreas: React.Dispatch<React.SetStateAction<string[]>>
   setAvailableCourseAreasList: React.Dispatch<React.SetStateAction<string[]>>
};


function CoursesMapped({ courseArea, university, onSelectedCoursesChange, selectedTotalCount, maxTotalCount, selectedCourseArea, setSelectedMapCourseAreas, setAvailableCourseAreasList }: ChildProps) {
   const [courses, setCourses] = useState([]);


   const fetchMappableCourses = async (courseArea: string, university: string) => {
       const response = await axios.get(`https://smuxchange-backend.vercel.app/database/getByCourseAreaAndUniversity/${courseArea}/${university}`);
       const courses = response.data;
       setCourses(courses);
       if (courses.length > 0) {
           setAvailableCourseAreasList((prev: string[]) =>
             !prev.includes(courseArea) ? [...prev, courseArea] : prev
           );
       } else {
           setAvailableCourseAreasList((prev: string[]) => prev.filter(area => area !== courseArea));
       }
   }


   useEffect(() => {
       fetchMappableCourses(courseArea[1], university);
       setSelectedCount(0);
       setSelectedMapCourseAreas([]);
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
       // Outer container: light card with blue borders
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

        {/* === Course Grid (auto adjusts between 1 or 2 columns) === */}
        <div className="w-full max-w-3xl mx-auto">
          <div
            className={`grid ${
              courses.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
            } gap-3 px-3 justify-center ${
              isExpanded ? "visible" : "hidden"
            }`}
          >
            {courses.map((course: any) => {
              const title = course["Course Title"];
              const selected = selectedButtons[title];

              return (
                <button
                  key={title}
                  className={`h-full text-center rounded-full px-5 py-3 text-sm transition-all duration-200 font-semibold col-md-12
                    ${
                      selected
                        ? "shadow-lg"
                        : "bg-white border border-[#102b72]/30 hover:bg-[#102b72]/10 hover:border-[#102b72]/50"
                    }
                    ${
                      isDisabled && !selected
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  style={{
                    backgroundColor: selected ? "#102b72" : undefined,
                    color: selected ? "#ffffff" : "#102b72",
                  }}
                  disabled={isDisabled && !selected}
                  onClick={() => {
                    setSelectedButtons((prev) => ({
                      ...prev,
                      [title]: !prev[title],
                    }));
                    setSelectedCount((prev) => (selected ? prev - 1 : prev + 1));
                  }}
                >
                  <span className="block leading-snug whitespace-normal break-words">
                    {title}
                  </span>
                </button>
              );
            })}
          </div>
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


export default CoursesMapped;