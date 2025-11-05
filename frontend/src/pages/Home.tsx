import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ThreeDLogo from "@/components/ThreeDLogo";
import WelcomeAnimation from "@/components/WelcomeAnimation";
import { useEffect, useState } from "react";
import { ArrowUp, Globe2 } from "lucide-react";

function TypingAnimation({ text, speed = 100 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [colorIndex, setColorIndex] = useState(0);

  const colorSchemes = [
    "from-blue-500 via-blue-600 to-emerald-500",
    "from-emerald-500 via-emerald-600 to-blue-500",
    "from-blue-600 via-emerald-500 to-blue-700",
    "from-emerald-600 via-blue-500 to-emerald-700",
    "from-blue-500 via-emerald-600 to-blue-600",
    "from-emerald-500 via-blue-600 to-emerald-600",
    "from-purple-500 via-blue-500 to-emerald-500",
    "from-cyan-500 via-blue-500 to-emerald-600",
    "from-blue-600 via-purple-500 to-emerald-500",
    "from-emerald-500 via-cyan-500 to-blue-600",
    "from-indigo-500 via-blue-500 to-emerald-500",
    "from-emerald-600 via-blue-600 to-cyan-500",
  ];

  useEffect(() => {
    let isTyping = true;
    let currentIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const animate = () => {
      if (isTyping) {
        // Typing forward
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(animate, speed);
        } else {
          // Finished typing, wait then start backspacing
          setTimeout(() => {
            isTyping = false;
            animate();
          }, 2000);
        }
      } else {
        // Backspacing
        if (currentIndex > 0) {
          currentIndex--;
          setDisplayedText(text.slice(0, currentIndex));
          timeoutId = setTimeout(animate, speed / 2); // Faster backspace
        } else {
          // Finished backspacing, change color and start over
          setColorIndex((prev) => (prev + 1) % colorSchemes.length);
          setTimeout(() => {
            isTyping = true;
            currentIndex = 0;
            animate();
          }, 500);
        }
      }
    };

    animate();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, speed, colorSchemes.length]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={`bg-gradient-to-r ${colorSchemes[colorIndex]} bg-clip-text text-transparent leading-none font-extrabold`} style={{ fontFamily: 'inherit' }}>
      {displayedText}
      <span className={showCursor ? "opacity-100" : "opacity-0"}>|</span>
    </span>
  );
}



function Home() {
  // Scroll constant
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

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

    // Check if first visit
    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedSMUxChange');
        if (!hasVisited) {
            setShowWelcome(true);
            localStorage.setItem('hasVisitedSMUxChange', 'true');
        }
    }, []);

    // Disable scroll when welcome animation is showing
    useEffect(() => {
        if (showWelcome) {
            // Disable scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable scroll
            document.body.style.overflow = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [showWelcome]);

    return (
        <div id="top">
            {showWelcome && (
                <WelcomeAnimation onClose={() => setShowWelcome(false)} />
            )}
            <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
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
                            <div className="space-y-6 animate-fade-in-up">
                                <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold mb-6 leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 9rem)', fontFamily: 'inherit' }}>
                                    <TypingAnimation text="SMUxChange" speed={150} />
                                </h1>

              {/* Subtitle */}
                                <p className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                                    An application designed to help SMU students <span className="text-emerald-600 font-semibold">plan</span> their exchange opportunities effectively
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/Mappable">
                                        <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold px-10 py-7 text-lg rounded shadow-2xl transition-all duration-300 hover:scale-105">
                    <span className="relative z-10 flex items-center gap-2">
                        Start Planning
                                                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </Button>
                </Link>
                 <Link to="/information">
                                        <Button className="group relative overflow-hidden bg-white hover:bg-blue-50 text-blue-600 font-semibold px-10 py-7 text-lg rounded transition-all duration-300 hover:scale-105 border-2 border-blue-500">
                    <span className="relative z-10 flex items-center gap-2">
                        Browse Schools
                                                <Globe2 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
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
                    <section className="relative px-6 md:px-12 lg:px-24 pb-16">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { num: "300+", label: "Partner Schools", color: "from-blue-500 to-blue-600" },
                                { num: "20k+", label: "Mapped Modules", color: "from-emerald-500 to-emerald-600" },
                                { num: "1k+", label: "Students Helped", color: "from-blue-600 to-emerald-500" }
                            ].map((stat, i) => (
                                <div key={i} className="group bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                    <div className={`text-5xl font-extrabold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent text-center`}>
                                        {stat.num}
          </div>
                                    <div className="text-slate-600 font-medium text-lg text-center">{stat.label}</div>
          </div>
                            ))}
        </div>
      </section>
      )}

      {/* === Key Features Section === */}
      {logoLoaded && (
                    <section className="relative py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-blue-100/30 via-emerald-100/30 to-cyan-100/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Key Features
            </h2>
                                <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto">
              Everything you need to plan your SMU exchange journey efficiently
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                                        className="group bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1"
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
                                            <h3 className="text-2xl font-bold mb-4 text-slate-800 group-hover:text-emerald-600 transition-colors">
                    {f.title}
                  </h3>
                                            <p className="text-base leading-relaxed text-slate-600">
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
                    <section className="relative py-24 px-6 md:px-12 lg:px-24">
                        <div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-sm border border-blue-200 rounded-3xl shadow-lg p-12 md:p-16">

                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                                    Ready to Start Your Journey?
          </h2>
                                <p className="text-xl md:text-2xl text-slate-700 mb-10 leading-relaxed max-w-3xl mx-auto">
                                    Join thousands of SMU students planning their dream exchange experience
          </p>


          <Link to="/Mappable">
                                    <button className="rounded group relative overflow-hidden bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 text-white font-bold px-14 py-6 text-xl rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-blue-500/50 hover:scale-105">
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                Get Started Now
                                            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </button>
          </Link>

                            </div>
        </div>
      </section>
      )}

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

export default Home;