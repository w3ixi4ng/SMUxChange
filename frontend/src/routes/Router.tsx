import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "../pages/Home.tsx";
import Information from "../pages/Information2.tsx";
import MappableV3 from "../pages/MappableV3.tsx";
import { Plane, House, MapIcon, GraduationCap } from "lucide-react";

function RouterView() {
  return (
    <Router>
      {/* ===== Navigation Bar ===== */}
      <nav
        className="shadow-sm w-full"
        style={{
          background: "linear-gradient(to right, #2D6A6A, #4BA6A6)",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <div className="flex flex-col lg:flex-row items-stretch w-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-3 text-white text-2xl font-bold gap-2">
            <Plane size={26} color="white" />
            <span>SMUxChange</span>
          </div>

          {/* Nav links */}
          <div className="flex flex-1 flex-col lg:flex-row text-center">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex-1 py-3 font-semibold flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? "bg-[#A7E3E3] text-yellow-400"
                    : "text-white hover:bg-[#A7E3E330]"
                }`
              }
            >
              <House size={20} color="currentColor" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/mappablev3"
              className={({ isActive }) =>
                `flex-1 py-3 font-semibold flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? "bg-[#A7E3E3] text-yellow-400"
                    : "text-white hover:bg-[#A7E3E330]"
                }`
              }
            >
              <MapIcon size={20} color="currentColor" />
              <span>Map</span>
            </NavLink>

            <NavLink
              to="/information"
              className={({ isActive }) =>
                `flex-1 py-3 font-semibold flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? "bg-[#A7E3E3] text-yellow-400"
                    : "text-white hover:bg-[#A7E3E330]"
                }`
              }
            >
              <GraduationCap size={20} color="currentColor" />
              <span>Schools</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* ===== Page Content ===== */}
      <main
        style={{
          background: "linear-gradient(160deg, #A6D3C8 0%, #E8F2EF 100%)",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/information" element={<Information />} />
          <Route path="/mappablev3" element={<MappableV3 />} />
          <Route path="/mappablev3/:school/:country" element={<MappableV3 />} />
        </Routes>
      </main>
    </Router>
  );
}

export default RouterView;
