import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import {
  House,
  MapIcon,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  LogIn,
  LogOut,
  UserPlus,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import Offcanvas from "react-bootstrap/Offcanvas";
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
  const [showOffcanvas, setShowOffcanvas] = useState(false);

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
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
          {/* Left side: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button - Visible below lg */}
            <button
              onClick={() => setShowOffcanvas(true)}
              className="lg:hidden text-white hover:bg-[#0d2259]/80 p-2 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={24} strokeWidth={2} />
            </button>
            
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-2 text-xl font-semibold text-white hover:text-gray-200 transition-colors"
              style={{ textDecoration: 'none' }}
              onClick={() => setShowOffcanvas(false)}
            >
              <img src="/images/earth.png" alt="Logo" className="w-10 h-10 mr-2" />
              <span style={{ textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>SMUxChange</span>
            </NavLink>
          </div>

          {/* Desktop Nav links - Hidden below lg */}
          <div className="hidden lg:flex items-center justify-end gap-2">
            {isAdmin ? (
              <>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                    `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                        `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                        `px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                      className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isExpanded
                          ? "bg-[#0d2259] text-white"
                          : "text-white hover:bg-[#0d2259]/80"
                        }`}
                      style={{ textDecoration: 'none', border: 'none', cursor: 'pointer' }}
                    >
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
                          <img src={`https://avatar.iran.liara.run/username?username=${name}`} decoding="async" alt="Profile" className="w-6 h-6 rounded-full" />
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

      {/* Offcanvas Menu - Mobile Navigation */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="start"
        style={{ backgroundColor: "#102b72", color: "white" }}
      >
        <Offcanvas.Header className="border-b border-[#0d2259]/50 flex justify-end">
          <button
            onClick={() => setShowOffcanvas(false)}
            className="text-white hover:bg-[#0d2259]/80 p-2 rounded transition-colors"
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div className="flex flex-col gap-1 p-4">
            {isAdmin ? (
              <>
                <NavLink
                  to="/admin"
                  onClick={() => setShowOffcanvas(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                  onClick={() => setShowOffcanvas(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                  onClick={() => setShowOffcanvas(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                  onClick={() => setShowOffcanvas(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                  onClick={() => setShowOffcanvas(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                      onClick={() => setShowOffcanvas(false)}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                      onClick={() => setShowOffcanvas(false)}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
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
                  <>
                    <NavLink
                      to="/profile"
                      onClick={() => {
                        setShowOffcanvas(false);
                        setIsExpanded(false);
                      }}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
                          ? "bg-[#0d2259] text-white"
                          : "text-white hover:bg-[#0d2259]/80"
                        }`}
                      style={{ textDecoration: 'none' }}
                    >
                      <img src={`https://avatar.iran.liara.run/username?username=${name}`} decoding="async" alt="Profile" className="w-6 h-6 rounded-full" />
                      <span style={{ textDecoration: 'none' }}>My Profile</span>
                    </NavLink>
                    <NavLink
                      to="/logout"
                      onClick={() => {
                        setShowOffcanvas(false);
                        setIsExpanded(false);
                      }}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${isActive
                          ? "bg-[#0d2259] text-white"
                          : "text-white hover:bg-[#0d2259]/80"
                        }`}
                      style={{ textDecoration: 'none' }}
                    >
                      <LogOut size={18} strokeWidth={2} />
                      <span style={{ textDecoration: 'none' }}>Logout</span>
                    </NavLink>
                  </>
                )}
              </>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

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
