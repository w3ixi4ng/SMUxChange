import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ThreeDLogo from "@/components/ThreeDLogo";
import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react";

//function scrollToTop() {
//  const topElement = document.getElementById("top");
//  if (topElement) {
//    topElement.scrollIntoView({ behavior: "auto" }); // instant scroll
//  }
//}

function Home() {
  // Scroll constant
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="top">
        <div
        className="relative w-full min-h-screen"
        style={{
            backgroundColor: "#eeeeee",
            color: "#102b72",
        }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
            <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700" />
            <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        </div>


        
      {/* === Hero Section === */}
      <section className="relative flex flex-col items-center justify-center px-6 mb-5">
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl scale-150" />
            <ThreeDLogo onLoaded={() => setLogoLoaded(true)} />
          </div>

          {/* Main Title */}
          {logoLoaded && (
            <div className="animate-fade-in-up">
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
                    <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold px-10 py-7 text-lg rounded-lg shadow-2xl transition-all duration-300 hover:scale-105">
                    <span className="relative z-10 flex items-center gap-2">
                        Start Planning
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </Button>
                </Link>
                 <Link to="/information">
                     <Button className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold px-10 py-7 text-lg rounded-lg transition-all duration-300 hover:scale-105">
                    <span className="relative z-10 flex items-center gap-2">
                        Browse Schools
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* === Quick Stats === */}
      {logoLoaded && (
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
      )}

      {/* === Key Features Section === */}
      {logoLoaded && (
      <section className="relative py-20 px-6 md:px-12 lg:px-24" style={{ backgroundColor: "#987d4d" }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#eeee" }}>
              Key Features
            </h2>
            <p className="text-lg md:text-xl font-normal max-w-3xl mx-auto" style={{ color: "#eeee", opacity: 0.7 }}>
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
      )}

      {/* === Call to Action Section === */}
      {logoLoaded && (
      <section className="relative py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-sm border border-[#102b72]/20 rounded-3xl shadow-lg p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#102b72" }}>
            Ready to Start Your Exchange Journey?
          </h2>
          <p className="text-lg md:text-xl font-normal mb-8 leading-relaxed" style={{ color: "#102b72", opacity: 0.8 }}>
            Join thousands of SMU students who are already using SMUxChange to plan their exchange experience
          </p>
          <Link to="/Mappable">
            <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold px-10 py-7 text-lg rounded-lg transition-all duration-300 hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                Get Started Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </Link>
        </div>
      </section>
      )}

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

export default Home;