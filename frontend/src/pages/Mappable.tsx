import MapSearch from "../components/MapSearch";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";




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
      <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">

        {/* === Subtle gradient + grid overlay === */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,43,114,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>


        {/*  Keeps MapSearch above the animated background */}
        <div className="relative z-10 w-full max-w-screen-xl mx-auto px-8 lg:px-10 py-10">
          <MapSearch />
        </div>


        {/* Scroll to top */}
        {showScrollButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded fixed bottom-8 right-8 z-50 h-14 w-14 flex items-center justify-center rounded-2xl shadow-2xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
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


