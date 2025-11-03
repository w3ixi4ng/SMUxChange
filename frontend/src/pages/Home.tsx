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
      video: "/videos/SchoolsExplore.mp4",
    },
    {
      title: "Module Mapping",
      desc: "Rediscover and find exchange mappings with ease.",
      video: "/videos/ModuleMap.mp4",
    },
    {
      title: "Experience Map",
      desc: "Watch students share their real exchange stories on the map.",
      video: "/videos/Placeholder.mp4",
    },
  ];

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

  // Scroll to absolute top on component mount/reload
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Force scroll to absolute top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
  }, []);

  return (
    <div id="top">
    <div
      className="relative w-full"
      style={{
        backgroundColor: "#eeeeee",
        color: "#102b72",
      }}
    >
      {/* === Subtle gradient + grid overlay === */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,43,114,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* === Hero Section === */}
      <section className="relative flex flex-col items-center justify-center px-6 mb-5">
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-12">
            <ThreeDLogo/>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: "#102b72" }}>
            SMUxChange
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-normal mb-12 max-w-3xl mx-auto leading-relaxed" style={{ color: "#102b72", opacity: 0.8 }}>
            An application designed to help SMU students plan their exchange opportunities effectively
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/Mappable">
              <Button
                className="font-medium hover:scale-105 transition-all duration-300 px-8 py-6 text-lg rounded-lg shadow-md hover:shadow-lg"
                style={{ backgroundColor: "#102b72", color: "#ffffff" }}
              >
                Start Planning
              </Button>
            </Link>
            <Link to="/information">
              <Button
                variant="outline"
                className="font-medium hover:scale-105 transition-all duration-300 px-8 py-6 text-lg rounded-lg border-2 hover:shadow-md"
                style={{ borderColor: "#102b72", color: "#102b72", backgroundColor: "transparent" }}
              >
                Browse Schools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* === Quick Stats === */}
      <section className="relative px-6 md:px-12 lg:px-24 mb-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/70 dark:bg-white/10 rounded-xl p-6 border border-[#102b72]/10">
            <div className="text-3xl font-bold" style={{ color: "#102b72" }}>300+</div>
            <div className="opacity-70">Partner Schools</div>
          </div>
          <div className="bg-white/70 dark:bg-white/10 rounded-xl p-6 border border-[#102b72]/10">
            <div className="text-3xl font-bold" style={{ color: "#102b72" }}>20k+</div>
            <div className="opacity-70">Mapped Modules</div>
          </div>
          <div className="bg-white/70 dark:bg-white/10 rounded-xl p-6 border border-[#102b72]/10 col-span-2 md:col-span-1">
            <div className="text-3xl font-bold" style={{ color: "#102b72" }}>1k+</div>
            <div className="opacity-70">Students Helped</div>
          </div>
        </div>
      </section>

      {/* === Key Features Section === */}
      <section className="relative py-20 px-6 md:px-12 lg:px-24" style={{ backgroundColor: "#987d4d" }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#102b72" }}>
              Key Features
            </h2>
            <p className="text-lg md:text-xl font-normal max-w-3xl mx-auto" style={{ color: "#102b72", opacity: 0.7 }}>
              Everything you need to plan your SMU exchange journey efficiently
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white/80 backdrop-blur-sm border border-[#102b72]/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Video/Demo Container */}
                <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-[#102b72]/5 to-[#102b72]/10">
                  {f.video && (
                    <video
                      src={f.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  {!f.video && (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-sm font-medium" style={{ color: "#102b72", opacity: 0.5 }}>
                        {f.title} demonstration
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#102b72" }}>
                    {f.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: "#102b72", opacity: 0.8 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Call to Action Section === */}
      <section className="relative py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-sm border border-[#102b72]/20 rounded-3xl shadow-lg p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#102b72" }}>
            Ready to Start Your Exchange Journey?
          </h2>
          <p className="text-lg md:text-xl font-normal mb-8 leading-relaxed" style={{ color: "#102b72", opacity: 0.8 }}>
            Join thousands of SMU students who are already using SMUxChange to plan their exchange experience
          </p>
          <Link to="/Mappable">
            <Button
              className="font-medium hover:scale-105 transition-all duration-300 px-10 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl"
              style={{ backgroundColor: "#102b72", color: "#ffffff" }}
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Scroll to top */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-md transition-opacity hover:scale-110"
          aria-label="Scroll to top"
          style={{ backgroundColor: "#102b72", color: "#ffffff", backdropFilter: "blur(5px)" }}
        >
          ↑
        </button>
      )}
      </div>
    </div>
  );
}

export default Home;