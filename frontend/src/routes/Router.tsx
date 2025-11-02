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
  LogIn,
  LogOut,
} from "lucide-react";
import Home from "../pages/Home.tsx";
import Information from "../pages/Information.tsx";
import Mappable from "../pages/Mappable.tsx";
import Login from "../pages/Login.tsx";
import Profile from "../pages/Profile.tsx";
import Logout from "../pages/Logout.tsx";
import { useState, useEffect, useRef } from "react";
import Signup from "../pages/Signup.tsx";
import Specifics from "../pages/Specifics.tsx";
import { ShareMap } from "@/pages/ShareMap.tsx";


function RouterView() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check login state from sessionStorage
  useEffect(() => {
    const checkLogin = () => {
      const uid = sessionStorage.getItem("uid");
      setIsLoggedIn(!!uid);
    };
    
    checkLogin();
    
    // Listen for auth changes
    window.addEventListener("authChange", checkLogin);
    
    // Poll for changes (in case of same-tab navigation)
    const interval = setInterval(checkLogin, 1000);
    
    return () => {
      window.removeEventListener("authChange", checkLogin);
      clearInterval(interval);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <Router>
      {/* ===== Navigation Bar ===== */}
      <nav
        className="sticky z-50 w-full backdrop-blur-md shadow-sm border-b border-[#102b72]/30"
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          backgroundColor: "#102b72",
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
          {/* Logo */}
          <NavLink 
            to="/"
            className="flex items-center gap-2 text-xl font-semibold text-white hover:text-gray-200 transition-colors"
            style={{ textDecoration: 'none' }}
          >
            <Plane size={24} className="text-white" strokeWidth={2} />
            <span style={{ textDecoration: 'none' }}>SMUxChange</span>
          </NavLink>

          {/* Nav links */}
          <div className="flex flex-1 flex-col lg:flex-row items-center justify-end gap-1 lg:gap-2 mt-4 lg:mt-0">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                  isActive
                    ? "bg-[#0d2259] text-white"
                    : "text-white hover:bg-[#0d2259]/80"
                }`
              }
              style={{ textDecoration: 'none' }}
            >
              <House size={18} strokeWidth={2} />
              <span style={{ textDecoration: 'none' }}>Home</span>
            </NavLink>

            <NavLink
              to="/mappable"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                  isActive
                    ? "bg-[#0d2259] text-white"
                    : "text-white hover:bg-[#0d2259]/80"
                }`
              }
              style={{ textDecoration: 'none' }}
            >
              <MapIcon size={18} strokeWidth={2} />
              <span style={{ textDecoration: 'none' }}>Map</span>
            </NavLink>

            <NavLink
              to="/information"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                  isActive
                    ? "bg-[#0d2259] text-white"
                    : "text-white hover:bg-[#0d2259]/80"
                }`
              }
              style={{ textDecoration: 'none' }}
            >
              <GraduationCap size={18} strokeWidth={2} />
              <span style={{ textDecoration: 'none' }}>Schools</span>
            </NavLink>

            {!isLoggedIn ? (
              <>
            <NavLink
                  to="/login"
              className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                  isActive
                        ? "bg-[#0d2259] text-white"
                        : "text-white hover:bg-[#0d2259]/80"
                }`
              }
                  style={{ textDecoration: 'none' }}
                >
                  <LogIn size={18} strokeWidth={2} />
                  <span style={{ textDecoration: 'none' }}>Login</span>
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                      isActive
                        ? "bg-[#0d2259] text-white"
                        : "text-white hover:bg-[#0d2259]/80"
                    }`
                  }
                  style={{ textDecoration: 'none' }}
                >
                  <span style={{ textDecoration: 'none' }}>Sign Up</span>
                </NavLink>
                </>
              ) : (
              <div className="relative profile-dropdown-container" ref={dropdownRef}>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                    isExpanded
                      ? "bg-[#0d2259] text-white"
                      : "text-white hover:bg-[#0d2259]/80"
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  <User size={18} strokeWidth={2} />
                  <span style={{ textDecoration: 'none' }}>Profile</span>
                  {isExpanded ? (
                    <ChevronUp size={16} strokeWidth={2} />
                  ) : (
                    <ChevronDown size={16} strokeWidth={2} />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0d2259] rounded-lg shadow-lg border border-[#0a1a47] py-1 z-50">
                    <NavLink
                      to="/profile"
                      onClick={() => setIsExpanded(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm text-white hover:bg-[#0a1a47] transition-colors ${
                          isActive ? "bg-[#0a1a47]" : ""
                        }`
                      }
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="flex items-center gap-2">
                        <User size={16} strokeWidth={2} />
                        <span style={{ textDecoration: 'none' }}>My Profile</span>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/logout"
                      onClick={() => setIsExpanded(false)}
                      className="block px-4 py-2 text-sm text-white hover:bg-[#0a1a47] transition-colors"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="flex items-center gap-2">
                        <LogOut size={16} strokeWidth={2} />
                        <span style={{ textDecoration: 'none' }}>Logout</span>
                      </div>
            </NavLink>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Page Content ===== */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/information" element={<Information />} />
          <Route path="/mappable" element={<Mappable />} />
          <Route path="/mappable/:school/:country" element={<Mappable />} />
          <Route path="/specifics/:universityName" element={<Specifics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shareMap" element={<ShareMap />} />
        </Routes>
      </main>
    </Router> 
  );
}

export default RouterView;
