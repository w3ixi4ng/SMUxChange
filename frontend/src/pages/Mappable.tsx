import MapSearch from "../components/MapSearch";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpIcon } from "lucide-react";

//function scrollToTop() {
//  const topElement = document.getElementById("top");
//  if (topElement) {
//    topElement.scrollIntoView({ behavior: "auto" }); // instant scroll
//  }
//}

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
    <div
      className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden"
      style={{
        backgroundColor: "#eeeeee",
        color: "#102b72",
      }}
    >


      {/*  Keeps MapSearch above the animated background */}
      <div className="relative z-10 container mx-auto px-4 py-10">
        <MapSearch />
      </div>
      {/* Scroll to top */}
        {showScrollButton && (
          <button
            onClick={() => window.scrollTo({top:0, behavior:'smooth'})}
            className="fixed bottom-6 right-6 z-50 h-11 w-11 flex items-center justify-center rounded-full shadow-lg border border-white/20 backdrop-blur-md transition transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Scroll to top"
            style={{ backgroundColor: "#102b72", color: "#ffffff" }}
          >
            <ArrowUpIcon className="w-5 h-5" style={{ color: "#ffffff" }} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Mappable;