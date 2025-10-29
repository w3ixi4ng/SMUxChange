import MapSearch from "../components/MapSearch";
import { useState, useEffect } from "react";

function scrollToTop() {
  const topElement = document.getElementById("top");
  if (topElement) {
    topElement.scrollIntoView({ behavior: "auto" }); // instant scroll
  }
}

function Mappable() {

  const [showScrollButton, setShowScrollButton] = useState(false);
  /* ========== Scroll listener (unchanged) ========== */
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    //  Main wrapper: switched to full-screen black backdrop, matches Home.tsx theme
    <div id="top">
    <div
      className="relative min-h-screen flex flex-col items-center justify-start text-white overflow-hidden"
      style={{
        backgroundColor: "#0a0a0a", // 📝 Deep black background
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 25%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04) 0%, transparent 30%)",
      }}
    >

      {/*  Keeps MapSearch above the animated background */}
      <div className="relative z-10 container mx-auto px-4 py-10">
        <MapSearch />
      </div>
      {/* Scroll to top */}
        {showScrollButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/70 text-white shadow-md hover:bg-black/90 transition-opacity"
            aria-label="Scroll to top"
            style={{ backdropFilter: "blur(5px)" }}
          >
            ↑
          </button>
        )}
      </div>
    </div>
  );
}

export default Mappable;