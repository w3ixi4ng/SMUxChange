import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import {
  Plane,
  House,
  MapIcon,
  GraduationCap,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Home from "../pages/Home.tsx";
import Information from "../pages/Information.tsx";
import Mappable from "../pages/Mappable.tsx";
import Login from "../pages/Login.tsx";
import Profile from "../pages/Profile.tsx";
import Logout from "../pages/Logout.tsx";
import { useState } from "react";

function RouterView() {
  const [isExpanded, setIsExpanded] = useState(false);
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
              to="/mappable"
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
              {isExpanded ? (
                <>
                <ChevronUp
                  size={20}
                  color="currentColor"
                  className="cursor-pointer"
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                  }}
                />
                <NavLink to="/logout">
                  <span>Logout</span>
                </NavLink>

                </>
              ) : (
                <ChevronDown
                  size={20}
                  color="currentColor"
                  className="cursor-pointer"
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                  }}
                />
              )}
            </NavLink>
          </div>
        </div>
      </nav>

      {/* ===== Page Content ===== */}
      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/information" element={<Information />} />
          <Route path="/mappable" element={<Mappable />} />
          <Route path="/mappable/:school/:country" element={<Mappable />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </Router> 
  );
}

export default RouterView;
