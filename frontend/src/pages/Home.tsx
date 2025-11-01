import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ThreeDLogo from "@/components/ThreeDLogo";
import { useEffect, useState } from "react";

function scrollToTop() {
  const topElement = document.getElementById("top");
  if (topElement) {
    topElement.scrollIntoView({ behavior: "auto" }); // instant scroll
  }
}

function Home() {
  // Scroll constant
  const [showScrollButton, setShowScrollButton] = useState(false);

  const features = [
    {
      title: "Discover Universities",
      desc: "Explore partner universities and exchange destinations worldwide.",
      video: "",
    },
    {
      title: "Module Mapping",
      desc: "Rediscover and find exchange mappings with ease.",
      video: "",
    },
    {
      title: "Experience Map",
      desc: "Watch students share their real exchange stories on the map.",
      video: "",
    },
  ];

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
    <div id="top">
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundColor: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 25%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04) 0%, transparent 30%)",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 25%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04) 0%, transparent 30%)",
        backgroundSize: "cover",
      }}
    >
      {/* === Subtle gradient + grid overlay === */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black opacity-90"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* === Content === */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* === Hero Section === */}
        <ThreeDLogo/>
        <div className="mb-12 mt-20 bg-white/5 backdrop-blur-md rounded-3xl shadow-lg px-10 py-8 max-w-3xl mx-auto border border-white/10">
          <h1 className="text-5xl font-bold mb-3 text-white">
            Welcome to{" "}
            <span className="text-gray-300 font-light">SMUxChange</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover, map, and experience global exchange opportunities — all in one place.
          </p>
        </div>

        {/* === Feature Cards === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 mb-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2"
            >
              <video
                src={f.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-56 object-cover opacity-80"
              />
              <div className="p-5 text-left">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {f.title}
                </h3>
                <p className="text-gray-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* === Button === */}
        <Link to="/Mappable">
          <Button
            className="bg-white text-black font-semibold hover:bg-gray-200 hover:scale-105 transition-transform px-8 py-3 text-lg rounded-full shadow-lg"
          >
            Explore the Map
          </Button>
        </Link>
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

export default Home;