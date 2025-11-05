import MapSearch from "../components/MapSearch";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";


function scrollToTop() {
 const topElement = document.getElementById("top");
 if (topElement) {
   topElement.scrollIntoView({ behavior: "auto" }); // instant scroll
 }
}


function Mappable() {


 const [showScrollButton, setShowScrollButton] = useState(false);
 const navigate = useNavigate();
 /* ========== Scroll listener (unchanged) ========== */
 useEffect(() => {
   function handleScroll() {
     if (window.scrollY > 200) {
       setShowScrollButton(true);
     } else {
       setShowScrollButton(false);
     }
   }
   window.addEventListener("scroll", handleScroll);
   return () => window.removeEventListener("scroll", handleScroll);
 }, []);


 useEffect(() => {
   window.scrollTo(0, 0);
 }, []);


 useEffect(() => {
   if (
     sessionStorage.getItem("uid") &&
     !(sessionStorage.getItem("name") || "").trim()
   ) {
     navigate("/profile");
   }
 }, []);


 return (
   <div id="top">
     <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
       {/*  Keeps MapSearch above the animated background */}
       <div className="relative z-10 w-full max-w-screen-xl mx-auto px-8 lg:px-10 py-10">
         <MapSearch />
       </div>

       {/* Scroll to top */}
       {showScrollButton && (
         <button
           onClick={scrollToTop}
           className="rounded fixed bottom-8 right-8 z-50 h-14 w-14 flex items-center justify-center rounded-2xl shadow-2xl bg-gradient-to-br from-green-200 to-blue-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
           aria-label="Scroll to top"
         >
           <ArrowUp className="w-6 h-6" />
         </button>
       )}
     </div>
   </div>
 );
}


export default Mappable;


