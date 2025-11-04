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
  UserPlus,
  ShieldCheck,
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
import axios from "axios";
import Admin from "@/pages/Admin.tsx";


function RouterView() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [name, setName] = useState<string>(sessionStorage.getItem("name") || "");


  const checkAdmin = async () => {
    try {
      const uid = sessionStorage.getItem("uid");
      if (!uid) {
        setIsAdmin(false);
        return;
      }
      const response = await axios.post('https://smuxchange-backend.vercel.app/database/checkAdmin', { uid });
      setIsAdmin(response?.data?.message === "admin");
    } catch (error) {
      console.log(error);
      setIsAdmin(false);
    }
  };

  // Check login state from sessionStorage
  useEffect(() => {
    const checkLogin = () => {
      const uid = sessionStorage.getItem("uid");
      setIsLoggedIn(!!uid);
      setName(sessionStorage.getItem("name") || "");
      // refresh admin flag whenever auth changes
      if (uid) {
        checkAdmin();
      } else {
        setIsAdmin(false);
      }
    };

    checkLogin();

    // Listen for auth changes
    window.addEventListener("authChange", checkLogin);

    // Remove frequent polling to avoid repeated admin checks
    return () => {
      window.removeEventListener("authChange", checkLogin);
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
            {isAdmin ? (
              <>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all w-full lg:w-auto ${isActive
                      ? "bg-[#0d2259] text-white"
                      : "text-white hover:bg-[#0d2259]/80"
                    }`}
                  style={{ textDecoration: 'none' }}
                >
                  <ShieldCheck size={18} strokeWidth={2} />
                  <span style={{ textDecoration: 'none' }}>Admin</span>
                </NavLink>
                <NavLink
                  to="/logout"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all w-full lg:w-auto ${isActive
                      ? "bg-[#0d2259] text-white"
                      : "text-white hover:bg-[#0d2259]/80"
                    }`}
                  style={{ textDecoration: 'none' }}
                >
                  <LogOut size={18} strokeWidth={2} />
                  <span style={{ textDecoration: 'none' }}>Logout</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all w-full lg:w-auto ${isActive
                      ? "bg-[#0d2259] text-white"
                      : "text-white hover:bg-[#0d2259]/80"
                    }`}
                  style={{ textDecoration: 'none' }}
                >
                  <House size={18} strokeWidth={2} />
                  <span style={{ textDecoration: 'none' }}>Home</span>
                </NavLink>

                <NavLink
                  to="/mappable"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all w-full lg:w-auto ${isActive
                      ? "bg-[#0d2259] text-white"
                      : "text-white hover:bg-[#0d2259]/80"
                    }`}
                  style={{ textDecoration: 'none' }}
                >
                  <MapIcon size={18} strokeWidth={2} />
                  <span style={{ textDecoration: 'none' }}>Map</span>
                </NavLink>

                <NavLink
                  to="/information"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all w-full lg:w-auto ${isActive
                      ? "bg-[#0d2259] text-white"
                      : "text-white hover:bg-[#0d2259]/80"
                    }`}
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
                        `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all w-full lg:w-auto ${isActive
                          ? "bg-[#0d2259] text-white"
                          : "text-white hover:bg-[#0d2259]/80"
                        }`}
                      style={{ textDecoration: 'none' }}
                    >
                      <LogIn size={18} strokeWidth={2} />
                      <span style={{ textDecoration: 'none' }}>Login</span>
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all w-full lg:w-auto ${isActive
                          ? "bg-[#0d2259] text-white"
                          : "text-white hover:bg-[#0d2259]/80"
                        }`}
                      style={{ textDecoration: 'none' }}
                    >
                      <UserPlus size={18} strokeWidth={2} />
                      <span style={{ textDecoration: 'none' }}>Sign Up</span>
                    </NavLink>
                  </>
                ) : (
                  <div className="relative profile-dropdown-container" ref={dropdownRef}>
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all w-full lg:w-auto ${isExpanded
                          ? "bg-[#0d2259] text-white rounded-lg"
                          : "text-white hover:bg-[#0d2259]/80 rounded-lg"
                        }`}
                      style={{ textDecoration: 'none', border: 'none', cursor: 'pointer', borderRadius: '0.5rem' }}
                    >
                      {/* <User size={18} strokeWidth={2} /> */}
                      <img src={`https://avatar.iran.liara.run/username?username=${name}`} decoding="async" alt="Profile" className="w-6 h-6 rounded-full" />
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
                            `block px-4 py-2 text-sm text-white hover:bg-[#0a1a47] transition-colors ${isActive ? "bg-[#0a1a47]" : ""
                            }`}
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
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Page Content ===== */}
      <main>
        <Routes>
          {!isAdmin && (
            <>
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
          </>
          )}
          {isAdmin && (
            <>
              <Route path="/admin" element={<Admin />} />
              <Route path="/logout" element={<Logout />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
    )
}

export default RouterView;
