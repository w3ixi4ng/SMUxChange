import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      title: "Discover Universities",
      desc: "Explore partner universities and exchange destinations worldwide.",
      video: "/videos/butterfly.mp4",
    },
    {
      title: "Accommodation Finder",
      desc: "See nearby student housing and price comparisons instantly.",
      video: "/videos/transport.mp4",
    },
    {
      title: "Experience Map",
      desc: "Watch students share their real exchange stories on the map.",
      video: "/videos/sights.mp4",
    },
  ];

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-[#1E4D4D] bg-cover bg-center bg-dark"
      style={{
        // backgroundImage: "url('/images/bg.jpg')", // <-- put your image here
        backgroundSize: "fit",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ===== Overlay to make text readable ===== */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>

      {/* ===== Content ===== */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* ===== Hero Bubble ===== */}
      <div className="mb-12 mt-20 bg-white/85 backdrop-blur-sm rounded-3xl shadow-lg px-10 py-8 max-w-3xl mx-auto border border-amber-200">
        <h1 className="text-5xl font-bold mb-3 text-[#1E4D4D]">
          Welcome to{" "}
          <span className="text-amber-500 drop-shadow-sm">SMUxChange</span>
        </h1>
        <p className="text-lg text-[#1E4D4D]/80 max-w-2xl mx-auto">
          Discover, map, and experience global exchange opportunities — all in one place.
        </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 mb-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
            >
              <video
                src={f.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Link to="/mappablev3">
          <Button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 text-lg rounded-full shadow-md">
            Explore the Map
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;