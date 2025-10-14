import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "../pages/Home.tsx";
import Information from "../pages/Information2.tsx";
import MappableV3 from "../pages/MappableV3.tsx";
import { Plane, House, MapIcon, GraduationCap, User } from "lucide-react";
import Login from "../pages/Login.tsx";
import Profile from "../pages/Profile.tsx";

function RouterView() {
  return (
    <Router>
      {/* ===== Navigation Bar ===== */}
      <nav
        className="shadow-sm w-full, bg-neutral-800"
        style={{
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
                    ? "bg-neutral-600"
                    : "text-white hover:bg-neutral-600"
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
                    ? "bg-neutral-600"
                    : "text-white hover:bg-neutral-600"
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
                    ? "bg-neutral-600"
                    : "text-white hover:bg-neutral-600"
                }`
              }
            >
              <GraduationCap size={20} color="currentColor" />
              <span>Schools</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex-1 py-3 font-semibold flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? "bg-neutral-600"
                    : "text-white hover:bg-neutral-600"
                }`
              }
            >
              <User size={20} color="currentColor" />
              <span>Profile</span>
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </Router>
  );
}

export default RouterView;
