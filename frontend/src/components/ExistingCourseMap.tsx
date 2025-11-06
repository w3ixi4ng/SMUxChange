import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";


type ChildProps = {
 courseArea: string | string[];
 university: string;
 onSelectedCoursesChange?: (
   courseAreaName: string,
   courseAreaLimit: number,
   selectedCourses: string[]
 ) => void;
 selectedTotalCount: number;
 maxTotalCount: number;
 selectedCourseArea: string;
 setSelectedMapCourseAreas: React.Dispatch<React.SetStateAction<string[]>>;
 setAvailableCourseAreasList: React.Dispatch<React.SetStateAction<string[]>>;
 map: any;
};


function ExistingCourseMap({
 courseArea,
 university,
 onSelectedCoursesChange,
 selectedTotalCount,
 maxTotalCount,
 selectedCourseArea,
 setSelectedMapCourseAreas,
 setAvailableCourseAreasList,
 map,
}: ChildProps) {
 const [courses, setCourses] = useState([]);
 const [selectedCount, setSelectedCount] = useState(0);
 const [selectedButtons, setSelectedButtons] = useState<{ [key: string]: boolean }>({});
 const [isDisabled, setIsDisabled] = useState(false);
 const [isExpanded, setIsExpanded] = useState(true);
 const maxCount = parseInt(courseArea[0]);


 // === Fetch courses for the course area ===
 const fetchMappableCourses = async (courseAreaName: string, university: string) => {
   const response = await axios.get(
     `https://smuxchange-backend.vercel.app/database/getByCourseAreaAndUniversity/${courseAreaName}/${university}`
   );
   const fetchedCourses = response.data;
   setCourses(fetchedCourses);


   if (fetchedCourses.length > 0) {
     setAvailableCourseAreasList((prev: string[]) =>
       !prev.includes(courseAreaName) ? [...prev, courseAreaName] : prev
     );
   }
 };


 useEffect(() => {
   fetchMappableCourses(courseArea[1], university);
 }, [courseArea, university]);


 // === Initialize selected state from map ===
 useEffect(() => {
   if (map?.map?.[courseArea[1]] && courses.length > 0) {
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


 // === Disable if max limit reached ===
 useEffect(() => {
   if (selectedCount >= maxCount || selectedTotalCount >= maxTotalCount) {
     setIsDisabled(true);
   } else {
     setIsDisabled(false);
   }
 }, [selectedCount, selectedTotalCount, maxTotalCount]);


 useEffect(() => {
   if (onSelectedCoursesChange) {
     const selectedCoursesList = Object.keys(selectedButtons).filter(
       (course) => selectedButtons[course]
     );
     onSelectedCoursesChange(courseArea[1], parseInt(courseArea[0]), selectedCoursesList);


     if (selectedCoursesList.length > 0) {
       setSelectedMapCourseAreas((prev: string[]) =>
         prev.includes(courseArea[1]) ? prev : [...prev, courseArea[1]]
       );
     } else {
       setSelectedMapCourseAreas((prev: string[]) =>
         prev.filter((area) => area !== courseArea[1])
       );
     }
   }
 }, [selectedButtons]);


 // === UI ===
 return (
   <>
     {courses.length > 0 && selectedCourseArea === courseArea[1] && (
       <div className="col-lg-12 col-12 bg-white/80 backdrop-blur-md border border-[#102b72]/20 py-4 rounded-3xl shadow-md mb-4">
         {/* Header */}
         <div className="relative flex flex-col items-center justify-center text-center mb-4">
           <h2 className="text-xl font-semibold mb-1 tracking-tight" style={{ color: "#102b72" }}>
             {courseArea[1]}
           </h2>


           <p
             className="text-sm transition-colors duration-300 font-medium"
             style={{
               color: "#102b72",
               opacity: selectedCount > 0 ? 1 : 0.7,
             }}
           >
             {courseArea[0] === "None"
               ? `${selectedCount} selected (No Limits)`
               : `${selectedCount}/${courseArea[0]} selected`}
           </p>


           <div
             className="absolute top-0 right-3 opacity-70 hover:opacity-100 transition"
             style={{ color: "#102b72" }}
           >
             {isExpanded ? (
               <ChevronUp onClick={() => setIsExpanded(false)} className="cursor-pointer" />
             ) : (
               <ChevronDown onClick={() => setIsExpanded(true)} className="cursor-pointer" />
             )}
           </div>
         </div>


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
                    className={`rounded-full px-5 py-3 text-sm font-semibold text-center transition-all duration-200 break-words leading-snug
                      ${
                        selected
                          ? "bg-[#5E9CFF] text-white shadow-md"
                          : "bg-white border border-[#102b72]/30 text-[#102b72] hover:bg-[#102b72]/10 hover:border-[#102b72]/50"
                      }
                      ${
                        isDisabled && !selected
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    disabled={isDisabled && !selected}
                    onClick={() => {
                      setSelectedButtons((prev) => ({
                        ...prev,
                        [title]: !prev[title],
                      }));
                      setSelectedCount((prev) => (selected ? prev - 1 : prev + 1));
                    }}
                  >
                    {title}
                  </button>
                );
              })}
            </div>
          </div>

         {/* Warning Message */}
         {selectedCount >= maxCount && (
           <div className="text-center mt-3 text-sm text-red-600">
             You have selected the maximum number of courses
           </div>
         )}
       </div>
     )}
   </>
 );
}


export default ExistingCourseMap;